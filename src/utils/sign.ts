import { ethers } from "ethers";

//TODO: Добавить тип Address и BigInt

export async function signNFTReward(
    uri: string, sender: string, signer: ethers.Wallet, contractAddress: string
) {
    const message = [uri, sender, contractAddress]
    const hashMessage = ethers.utils.solidityKeccak256([
        "string","uint160","uint160"
    ], message)
    const sign = await signer.signMessage(ethers.utils.arrayify(hashMessage));
    const r = sign.substr(0, 66)
    const s = `0x${sign.substr(66, 64)}`;
    const v = parseInt(`0x${sign.substr(130,2)}`);
    return {r,s,v}
}

export async function signTokenReward(
    rewardEventId: string,
    amount: string, senderAddress: string, 
    signer: ethers.Wallet, managerAddress: string, tokenAddress: string
) {
    const message = [amount, senderAddress, tokenAddress, managerAddress, rewardEventId]
    const hashMessage = ethers.utils.solidityKeccak256([
        "uint256","uint160","uint160","uint160", "string"
    ], message)
    const sign = await signer.signMessage(ethers.utils.arrayify(hashMessage));
    const r = sign.substr(0, 66)
    const s = `0x${sign.substr(66, 64)}`;
    const v = parseInt(`0x${sign.substr(130,2)}`);
    return {r,s,v}
}