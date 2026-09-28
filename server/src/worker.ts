import 'dotenv/config';
import fs from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import { sendOrderDeliveryEmail } from './email.js';
const db=new PrismaClient(); const MAX=4;
async function audit(event:string,orderId:number,userId:number,metadata?:object){await db.auditLog.create({data:{event,orderId,userId,actor:'delivery-worker',metadata}})}
async function processDue(){
 const rows=await db.emailDelivery.findMany({where:{scheduledFor:{lte:new Date()},status:{in:['PENDING','RETRY']},attempts:{lt:MAX}},include:{order:{include:{user:true}}},take:25});
 for(const d of rows){
  const claimed=await db.emailDelivery.updateMany({where:{id:d.id,status:{in:['PENDING','RETRY']}},data:{status:'PROCESSING',lastAttemptAt:new Date(),attempts:{increment:1}}}); if(!claimed.count) continue;
  try { if(d.order.status!=='PAYMENT_APPROVED' && d.order.status!=='DELIVERY_SCHEDULED' && d.order.status!=='DELIVERY_PROCESSING') throw new Error('Order is not approved'); if(d.pdfPath)await fs.access(d.pdfPath); await db.order.update({where:{id:d.orderId},data:{status:'DELIVERY_PROCESSING'}}); const current=await db.emailDelivery.findUniqueOrThrow({where:{id:d.id}}); await sendOrderDeliveryEmail(current,d.order); await db.$transaction([db.emailDelivery.update({where:{id:d.id},data:{status:'DELIVERED',sentAt:new Date(),errorMessage:null}}),db.order.update({where:{id:d.orderId},data:{status:'DELIVERED'}})]); await audit('EMAIL_SENT',d.orderId,d.userId);
  } catch(error){const message=error instanceof Error?error.message:'Unknown delivery error'; const attempts=d.attempts+1; const final=attempts>=MAX; await db.emailDelivery.update({where:{id:d.id},data:{status:final?'FAILED':'RETRY',errorMessage:message}}); await db.order.update({where:{id:d.orderId},data:{status:final?'DELIVERY_FAILED':'DELIVERY_SCHEDULED'}}); await audit('EMAIL_FAILED',d.orderId,d.userId,{attempts,error:message});}
 }
}
async function boot(){await processDue(); setInterval(()=>processDue().catch(console.error),60_000)} boot().catch(e=>{console.error(e);process.exit(1)});
