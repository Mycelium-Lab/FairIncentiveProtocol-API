import { erc20UniversalAbi, fpManagerAbi } from './contracts/token_contracts.js'
let address

function createLongStrView(str) {
    try {
        return str.slice(0, 6) + '...' + str.slice(str.length - 4, str.length)
    } catch (error) {
        return ''
    }
}

async function connect() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        address = await signer.getAddress()
        document.querySelector('#connect-button').textContent = createLongStrView(address)
        // const chainid = (await provider.getNetwork()).chainId
    } catch (error) {
        console.log(error)
    }
}

async function main() {
    //TODO: смотреть на разные сути (chainid)
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    const res = await fetch(
        `/rewards/events/claimabletoken?id=${params.id}&user_id=${params.user_id}`, requestOptions)
    const json = await res.json()
    document.querySelector('#connect-button').addEventListener('click', async () =>  {
        await connect()
    })
    document.querySelector('#user-address').textContent =  createLongStrView(json.claimableToken.user_wallet)
    document.querySelector('#token-amount').textContent =  ethers.utils.formatEther(json.claimableToken.reward_amount)
    document.querySelector('#token-symbol').textContent =  json.claimableToken.token_symbol
    if (json.claimableToken.reward_description) {
        document.querySelector('#reward-description').textContent = json.claimableNFT.reward_description
    } else {
        document.querySelector('#reward-description').textContent = 'Description'
    }
    document.querySelector('#claim-button').addEventListener('click', async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(json.claimableToken.fpmanager, fpManagerAbi, signer)
            const tx = await contract.mintSigner(
                json.claimableToken.r, json.claimableToken.v, json.claimableToken.s, 
                json.claimableToken.token_address, json.claimableToken.reward_amount
            )
            tx.wait()
                .then( async () => {
                    try {
                        // wasAdded is a boolean. Like any RPC method, an error can be thrown.
                        const wasAdded = await ethereum.request({
                          method: 'wallet_watchAsset',
                          params: {
                            type: 'ERC20', // Initially only supports ERC-20 tokens, but eventually more!
                            options: {
                              address: json.claimableToken.token_address, // The address of the token.
                              symbol: json.claimableToken.token_symbol, // A ticker symbol or shorthand, up to 5 characters.
                              decimals: 18 // The number of decimals in the token.
                            },
                          },
                        });
                      
                        if (wasAdded) {
                          console.log('Thanks for your interest!');
                        } else {
                          console.log('Your loss!');
                        }
                    } catch (error) {
                    console.log(error);
                    }
                })
            
        } catch (error) {
            console.log(error)
        }
    })
}

main().catch(err => console.log(err))