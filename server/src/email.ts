import nodemailer from 'nodemailer';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { EmailDelivery, Order, User } from '@prisma/client';

const required = ['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASSWORD','SMTP_FROM'];
function configured(){ return required.every(k=>Boolean(process.env[k])); }
function replace(template:string, values:Record<string,string>){ return template.replace(/{{\s*(\w+)\s*}}/g,(_,key)=>values[key] ?? 'INFORMATION NOT CONFIGURED'); }
export async function sendAdminMessage(to:string, subject:string, text:string){if(!configured())throw new Error('SMTP is INFORMATION NOT CONFIGURED');const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT),secure:Number(process.env.SMTP_PORT)===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}});await transport.sendMail({from:`${process.env.SMTP_FROM_NAME??'ShadowTm'} <${process.env.SMTP_FROM}>`,to,subject,text});}
export async function sendOrderDeliveryEmail(delivery: EmailDelivery, order: Order & {user: User}){
 if(!configured()) throw new Error('SMTP is INFORMATION NOT CONFIGURED');
 const attachments=[] as {filename:string;content:Buffer;contentType:string}[];
 if(delivery.pdfPath){const pdf=await fs.readFile(path.resolve(delivery.pdfPath));attachments.push({filename:`ShadowTm-Order-${order.id}.pdf`,content:pdf,contentType:'application/pdf'})}
 const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT),secure:Number(process.env.SMTP_PORT)===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}});
 const deliveryData=(delivery.deliveryData&&typeof delivery.deliveryData==='object'&&!Array.isArray(delivery.deliveryData)?delivery.deliveryData:{}) as Record<string,unknown>;
 const values={user_name:`${order.user.firstName} ${order.user.lastName??''}`.trim(),order_id:String(order.id),product_name:String(deliveryData.product_name??order.type),country:'INFORMATION NOT CONFIGURED',amount:String(order.price),order_date:order.createdAt.toISOString(),approved_at:order.paymentApprovedAt?.toISOString()??'INFORMATION NOT CONFIGURED',server_ip:String(deliveryData.server_ip??'INFORMATION NOT CONFIGURED'),server_port:String(deliveryData.server_port??'INFORMATION NOT CONFIGURED'),server_password:String(deliveryData.server_password??'INFORMATION NOT CONFIGURED'),license_key:String(deliveryData.license_key??'INFORMATION NOT CONFIGURED'),license_term:String(deliveryData.license_term??'INFORMATION NOT CONFIGURED')};
 await transport.sendMail({from:`${process.env.SMTP_FROM_NAME??'ShadowTm'} <${process.env.SMTP_FROM}>`,to:delivery.email,subject:replace(delivery.emailSubject,values),text:replace(delivery.emailBody,values),attachments});
}
