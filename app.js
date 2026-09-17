const boot=document.querySelector('#boot');
window.addEventListener('load',()=>setTimeout(()=>boot.classList.add('hide'),650));

const notice=document.querySelector('#notice');
let noticeTimer;
function notify(message){notice.textContent=message;notice.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('show'),4200)}

const TOKEN_CA='TBA';
const caValue=document.querySelector('#ca-value');
const copyCA=document.querySelector('#copy-ca');
if(/^0x[a-fA-F0-9]{40}$/.test(TOKEN_CA)){caValue.textContent=TOKEN_CA;copyCA.disabled=false;copyCA.textContent='COPY CA';copyCA.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(TOKEN_CA);copyCA.textContent='COPIED';notify('Official contract address copied.');setTimeout(()=>copyCA.textContent='COPY CA',1800)}catch{notify('Copy failed. Select the address manually.')}})}

const chain={chainId:'0x1237',chainName:'Robinhood Chain',nativeCurrency:{name:'Ether',symbol:'ETH',decimals:18},rpcUrls:['https://rpc.mainnet.chain.robinhood.com'],blockExplorerUrls:['https://robinhoodchain.blockscout.com']};
const announcedProviders=[];
const boundProviders=new WeakSet();
window.addEventListener('eip6963:announceProvider',event=>{if(!announcedProviders.some(item=>item.info.uuid===event.detail.info.uuid))announcedProviders.push(event.detail)});
window.dispatchEvent(new Event('eip6963:requestProvider'));
function getProvider(){const robinhood=announcedProviders.find(item=>(item.info.rdns||'').toLowerCase().includes('robinhood'));return robinhood&&robinhood.provider||announcedProviders[0]&&announcedProviders[0].provider||window.ethereum||null}
const wallet=document.querySelector('#wallet');
const walletText=wallet.querySelector('span');
let connectedAddress='';
function shortAddress(address){return address.slice(0,6)+'...'+address.slice(-4)}
function syncWallet(accounts){connectedAddress=accounts&&accounts[0]||'';walletText.textContent=connectedAddress?shortAddress(connectedAddress):'CONNECT WALLET';wallet.classList.toggle('connected',Boolean(connectedAddress));wallet.title=connectedAddress||'Connect an EVM wallet'}
function syncChain(chainId){wallet.classList.toggle('wrong-network',Boolean(connectedAddress)&&chainId.toLowerCase()!==chain.chainId)}
function bindProvider(provider){if(!provider||boundProviders.has(provider)||!provider.on)return;boundProviders.add(provider);provider.on('accountsChanged',syncWallet);provider.on('chainChanged',syncChain);provider.on('disconnect',()=>syncWallet([]))}
async function addNetwork(){const provider=getProvider();if(!provider){notify('No EVM wallet detected. Open this page in Robinhood Wallet or install a browser wallet.');return false}bindProvider(provider);try{await provider.request({method:'wallet_switchEthereumChain',params:[{chainId:chain.chainId}]});syncChain(chain.chainId);notify('Robinhood Chain is active.');return true}catch(error){if(error.code===4902){try{await provider.request({method:'wallet_addEthereumChain',params:[chain]});syncChain(chain.chainId);notify('Robinhood Chain was added to your wallet.');return true}catch(addError){notify(addError.message||'The network request was declined.');return false}}notify(error.message||'Unable to switch networks.');return false}}
async function connect(){const provider=getProvider();if(!provider){notify('No EVM wallet detected. Open this page in Robinhood Wallet or install MetaMask.');return}bindProvider(provider);walletText.textContent='CONNECTING...';try{const accounts=await provider.request({method:'eth_requestAccounts'});syncWallet(accounts);if(accounts.length)await addNetwork()}catch(error){syncWallet([]);notify(error.message||'Wallet connection was cancelled.')}}
wallet.addEventListener('click',connect);
document.querySelector('#add-network').addEventListener('click',addNetwork);
setTimeout(()=>{const provider=getProvider();if(provider){bindProvider(provider);provider.request({method:'eth_accounts'}).then(syncWallet).catch(()=>{});provider.request({method:'eth_chainId'}).then(syncChain).catch(()=>{})}},100);

const agents=[...document.querySelectorAll('.agent')];
const toast=document.querySelector('#toast');
function easternTime(){return new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date())+' ET'}
document.querySelectorAll('.log time,.toast b').forEach(time=>time.textContent=time.textContent+' ET');
document.querySelector('.console-bar span:last-child').textContent+=' / TIME: ET';
const notes={Manager:'MANAGER_01 is routing the next dependency',Brand:'BRAND_07 delivered identity system',Web:'WEB_12 submitted interactive preview',Copy:'COPY_03 is refining launch language',Human:'REVIEWER accepted visual consistency task',Audit:'AUDIT_09 verified 4 of 7 deliverables'};
agents.forEach(card=>card.addEventListener('click',()=>{agents.forEach(a=>a.classList.remove('active'));card.classList.add('active');toast.innerHTML='<b>'+easternTime()+'</b> '+notes[card.dataset.a]}));
const events=[['WEB_12 submitted preview',68],['REVIEWER accepted assignment',71],['AUDIT_09 verified artifact',76],['COPY_03 released unused budget',73],['MANAGER_01 opened final review',79]];
let eventIndex=0;
setInterval(()=>{const item=events[eventIndex++%events.length];toast.style.opacity=0;setTimeout(()=>{toast.innerHTML='<b>'+easternTime()+'</b> '+item[0];toast.style.opacity=1},220);document.querySelector('#percent').textContent=item[1]+'%';document.querySelector('#meter').style.width=item[1]+'%'},4200);

document.querySelector('#inspect').addEventListener('click',()=>document.querySelector('#protocol').scrollIntoView({behavior:'smooth'}));
const form=document.querySelector('#form');
const dialog=document.querySelector('#dialog');
form.addEventListener('submit',event=>{event.preventDefault();document.querySelector('#dialog-text').textContent=document.querySelector('#outcome').value.trim();document.querySelector('#dialog-budget').textContent=document.querySelector('#budget').value+' USDC maximum';document.querySelector('#dialog-deadline').textContent=document.querySelector('#deadline').value;dialog.showModal()});
document.querySelector('#close').addEventListener('click',()=>dialog.close());
document.querySelector('#dialog-wallet').addEventListener('click',connect);
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog.open)dialog.close()});
