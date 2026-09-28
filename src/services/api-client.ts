const apiBaseKey='shadowtm-api-base-url';
const adminKeyName='shadowtm-admin-api-key';
const userTokenName='shadowtm-user-token';
export function getApiBase(){const configured=localStorage.getItem(apiBaseKey)?.trim().replace(/\/$/,'');return configured||String(import.meta.env.VITE_API_BASE_URL||'').trim().replace(/\/$/,'')}
export function setApiConnection(baseUrl:string,adminKey:string){const base=baseUrl.trim().replace(/\/$/,'');if(base&&!/^https:\/\//i.test(base))throw new Error('API URL must use HTTPS');if(base)localStorage.setItem(apiBaseKey,base);else localStorage.removeItem(apiBaseKey);if(adminKey.trim())sessionStorage.setItem(adminKeyName,adminKey.trim());else sessionStorage.removeItem(adminKeyName);window.dispatchEvent(new Event('api-connection-change'))}
export function setUserToken(token?:string){if(token)localStorage.setItem(userTokenName,token);else localStorage.removeItem(userTokenName)}
export async function apiFetch(path:string,init:RequestInit={}){const base=getApiBase(),headers=new Headers(init.headers);if(path.startsWith('/api/admin/')){const key=sessionStorage.getItem(adminKeyName);if(key)headers.set('x-admin-key',key)}const token=localStorage.getItem(userTokenName);if(token&&!headers.has('Authorization'))headers.set('Authorization',`Bearer ${token}`);return fetch(`${base}${path}`,{...init,headers})}
