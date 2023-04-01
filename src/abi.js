import { fetcher } from "@/utils"
import { getAbi, insertAbi } from '@/utils/database'

export default async function handler(req, res) {
    const address = req.query.address

    if (!address) {
        res.status(500)
        return
    }

    let abi = await getAbi(address)
    console.log(abi)
    if (abi) {
        res.status(200).json(abi.abi)
        return
    }

    const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`

    const config = {
        headers: {
            Accept: 'application/json',
        },
    }

    const resp = await fetcher(url, config)
    if (resp) await insertAbi(address, resp.result)
    res.status(200).json(resp.result)
}

