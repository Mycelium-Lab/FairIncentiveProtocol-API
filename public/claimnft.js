import { erc721DefaultRoyaltyAbi, erc721TokenRoyaltyAbi } from './contracts/contracts.js'
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
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    const res = await fetch(
        `/rewards/events/claimablenft?id=${params.id}&user_id=${params.user_id}`, requestOptions)
    const json = await res.json()
    const resImage = await fetch(json.claimableNFT.nft_image)
    const imageJson = await resImage.json()
    document.querySelector('#connect-button').addEventListener('click', async () =>  {
        await connect()
    })
    document.querySelector('#user-address').textContent =  createLongStrView(json.claimableNFT.user_wallet)
    document.querySelector('#nft-name').textContent =  json.claimableNFT.nft_name
    document.querySelector('#collection-name').textContent =  json.claimableNFT.collection_name
    document.querySelector('#nft-image').src = imageJson.image
    if (json.claimableNFT.nft_description) {
        document.querySelector('#nft-description').textContent = json.claimableNFT.nft_description
    } else {
        document.querySelector('#nft-description').textContent = 'Description'
    }
    document.querySelector('#claim-button').addEventListener('click', async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            let contract
            if (json.claimableNFT.beneficiary) {
                contract = new ethers.Contract(json.claimableNFT.collection_address, erc721DefaultRoyaltyAbi, signer)
            } else {
                contract = new ethers.Contract(json.claimableNFT.collection_address, erc721TokenRoyaltyAbi, signer)
            }
            const tx = await contract.safeMintSigner(json.claimableNFT.r, json.claimableNFT.v, json.claimableNFT.s, json.claimableNFT.nft_image)
            const res = await tx.wait()
            const tokenID = res.events.find(v => v.event === 'SafeMintSigner').args.ID
            document.querySelector('#collection-address').textContent = json.claimableNFT.collection_address
            document.querySelector('#tokenid').textContent = tokenID
            document.querySelector('#instruction').style.display = 'block'
        } catch (error) {
            console.log(error)
        }
    })
}

main().catch(err => console.log(err))