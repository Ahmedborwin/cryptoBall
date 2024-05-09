const { networks } = require("../networks")
const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")
const hre = require("hardhat")
const { SubscriptionManager } = require("@chainlink/functions-toolkit")
const updateContractInfo = require("../scripts/utils/updateAddress&ABI")
const { uploadMetadataAsBatch } = require("../scripts/utils/uploadPinata")

let tokenUris = [
  "ipfs://QmYNiyyaiwVNmCLeG6Ahe4wPWz3jqVnCUfRhXwZuKevWaA",
  "ipfs://QmaAkqsiPGDHUHgR5BdeJdb8sio3hVjETEyhFWwkfHbXc3",
  "ipfs://QmRHMwvKXy1LnBKF4sjETP8gj2u2j8HwJFS1eHRFrzn6bJ",
  "ipfs://QmekWoGumynUZ4aqD4UpekqvQ57TdSxMxVfg1r2AdU5HnT",
  "ipfs://QmSRJP5vB6arj4PwHq3v2GGE5tgoy3YRut5Y4iWUV1ZDek",
  "ipfs://QmdyaavsZnopu8yQWDKzucguEVjrYmbZWJBc6Xvo1HpjY8",
  "ipfs://QmRzbKKwjkBaV28P1Kq7PyiKD1XqU69MPcj1JUwrtHnqzP",
  "ipfs://QmdC3Am5zhCbWnUFBEUC92cYpeWmvkebACnhvq8zGXSusb",
  "ipfs://QmTPGx43Zri2N489GQ1FuuiZiXN8HwDSkfb4X67b7KQSMS",
  "ipfs://QmcsHG5sQUMr34KV516ggD1GneLUbBjzYwEVELoDjyn7vX",
  "ipfs://QmaER6Jc4ngd6hRBVJtVqFxZ1ovATeCLuZdwaLTDx8ADQY",
  "ipfs://QmQ7Do7UVpgqyUNd8ra4qTdKd4mHaiUbYzZMEdKhL43LrP",
  "ipfs://QmV515KzFcM4pp8ePWm9bnTYP5iW8i7Jg9eUBqFR4q7JhM",
  "ipfs://QmVZXiskbe3KFFhTkqrwPEKMMEmbXmZkAKN9i7bpgi2Vzm",
  "ipfs://QmZjA4wG1DbbsEcMkyfZGtZcKsHLnjMAM2qufp7bGWfKDu",
  "ipfs://QmTvbxpj1CrQCsm7m3w74nFmdPs1cfpDptXuPrYmvnR9Jj",
  "ipfs://QmdDA8E38k7wkxDqSPDPw5hGQFyGSQ4M1Gq7z8P7YgPNBk",
  "ipfs://QmVBPKzQtSDVkKm22ocwz7ELdHgaFyLUYB2C8LaPGt8QaD",
  "ipfs://QmbDPzRYbucHLJnn9hydQYYQLeaFTgxLFrhXcTGN99dyKL",
  "ipfs://QmTdjE26E4suRg8ow1ukDH1CdnoMfCy4UBUwk8Fq7yUHyQ",
  "ipfs://QmWgr9ok1DWApLxQfRDgEBQvJyjggHMKRqbmG56rwfmPp5",
  "ipfs://QmWn32ov6JTukNs6YE8v9J2KgsE7PLALcpPC9nxQA6jMHq",
  "ipfs://QmZU2U5zGT3jJW1jMzfaWxWqKfaJiFSkoirRoYS7CjQt9Z",
  "ipfs://QmcwrKR34R8oPPDR5CGjReAzbUjgnuGbFdbeYNoueHAasZ",
  "ipfs://QmXwENh55Whx8rLLCawXymHmVRxuJTWU19VrpENYcyDWJR",
  "ipfs://QmeSeacDyVfp43N2hYwVcYDjtay2VwbWcuTYFyFUaWB5pZ",
  "ipfs://Qmdbpx2pM3f6HQ315EbkKUZfKLMYL1q2vaG64kJUJMYycP",
  "ipfs://QmdQ5rAVU8DvPWQULWvUAoFaS4H3UBEp6qM2hzMCGtZSyL",
  "ipfs://QmSSF2rPevEyZTuQqsDEse7HGxjQUm1ci1vCKDvcSdsfF8",
  "ipfs://QmSKiKYDsdK5s2a6RvBWnCQbCzdtHs8wrHa3pJo2BDSaM4",
  "ipfs://QmNzs7rYLt5VwYwu3rJod5Y8Mf8Se91CfcVz7XpHeqptAs",
  "ipfs://Qmf7Vof5dcnJw1MyQPgfqskW9bXcKi4qGgPJQM1ZQx3rvy",
  "ipfs://QmWqQoXmPVGkiZ8zNQWwhRzSNuhrNaqekWP3iMXK7T6Kbp",
  "ipfs://QmbCpSpXbDmSzYCnVe1kFJ8A5nTQrLJpf7jVCaaNzDPQkk",
  "ipfs://Qma1nGN61ZwMUQQxo9HvcKBitraxvfXpFqvSyjGcykHTUB",
  "ipfs://QmRMdpcKPdjUfm1934mC5d6F4u2ZKwmU7ei5bJ5GtyC2D9",
  "ipfs://Qmex6bMF5c5G7tbSzb5zWrvU3YvmH4p5uPkHj5aRFyba5S",
  "ipfs://QmcCiFXLqz5jAuX1KdMmA5UNgGWgaxZHyxMzVW11BiR3NB",
  "ipfs://QmWoT93gkFfik8AzCoZoHqqJHwnhUYWidiPSuFcoiKgnLY",
  "ipfs://QmVHk6xBVhRFFhSJ5BrwddYvysoZU2aBApsmYbQyHowV25",
  "ipfs://QmXuJnhHVYATZv5KDr84NGvDh4xoKiJezjZWabMnWCqaGq",
  "ipfs://QmQNeuE9o8ZGrL8Ss4RL1N2wTwLrHXVR2CUWC5nDtWV8uB",
  "ipfs://QmTsSE3ZvK5yQR4PhPQ3MEahdHPbamVVgAqd6FvGTsdd11",
  "ipfs://QmNVkV9NGuQCnKbL9mZED12JruLDUxKobUVUvSgM4AtaqD",
  "ipfs://QmT7oorGn983quoZLaSpVKP4xphGBxN8fZvmNaETYjBt6z",
  "ipfs://QmPHFk1SpPjDSCdMvwa6SBDXPuUaA7BhEkxspKY2FtBvj3",
  "ipfs://QmRZALbEkLFD7ihLnZbeKLPCAZhhNJz9YrGqbfZ3BayqML",
  "ipfs://QmXTpwgmdrDT7uwtNmxpH3RbEfhobMBrdhtbXVS4X7hMxg",
  "ipfs://QmVpTuxH4ftd96dtw6ZanTyGJxsPTAeazYmcA6xudgqpiG",
  "ipfs://QmcgvLiovfuhWTfhtpBJ3pn6avjmFdpmAT3Xkg8FnQMfL3",
  "ipfs://QmQkS2htMR5PLJdonxmkuGqMqDRxFwiUkjUu5jHnbGhZWL",
  "ipfs://Qmd6uSomsAGC8qkrqgafF7XyqqDhSSYBggH6YogUrhWH11",
  "ipfs://QmTCQxiZnWg4EU2xK4H78YFvTpeVhhDVx4a39qhLsqXzqc",
  "ipfs://QmQJA3jqN13Kiq1A4GTb9JwvgzY1CceJww72emqqZZhsRV",
  "ipfs://QmWmbDgSQxxd8zdJDjc4Wr8KQCgo2AFC7AEz8RkED4n7Qy",
  "ipfs://QmTz2xb2bKRTapp2MzQJS8cB9EXHmk9nf5mWCbMLuf21ky",
  "ipfs://QmPmQsxPGN9RoN7kKDRs2gwXu865nbX4T5FiaEVkoisJjF",
  "ipfs://QmcguX6goJUMrEr8k9PFhHGceRNMWp7fvRnuMT7xmNZ6um",
  "ipfs://Qma42mqKez5CNGNCZTDWfN7ZGRuuC5CzJmLgLfo3VZ1qv8",
  "ipfs://Qmb4QrvNNDMHrx5J6PaUY6kkXUHzc2wV68AWENXw6qZqsQ",
]

async function handleTokenUris() {
  // Upload player metadata and get responses
  console.log("Uploading player metadata...")
  const uploads = await uploadMetadataAsBatch()

  // // Update tokenUris array with new IPFS URIs
  // tokenUris = uploads.map(upload => `ipfs://${upload.ipfsHash}`);
  // console.log("Token URIs uploaded! They are:");
  // console.log(tokenUris);
  // return tokenUris;
}
/**
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployNFTContract = async function () {
  const signer = await hre.ethers.getSigner()

  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris()
  }

  // Get the deployed contract to interact with it after deploying.
  const CBNFT = await hre.ethers.deployContract("CBNFT", [tokenUris, signer.address])

  //write address and ABI to config
  await updateContractInfo({ undefined, NFTAddress: CBNFT.address, undefined })

  // await CBNFT.minNFT(2, signer.address)
  // await CBNFT.minNFT(4, signer.address)
  // await CBNFT.minNFT(5, signer.address)

  return { CBNFT, signer }
}

deployNFTContract()
  .then(async (result) => {
    if (hre.network.name !== "localhost" && hre.network.name !== "localFunctionsTestnet") {
      await hre.run("verify:verify", {
        address: result.CBNFT.address,
        constructorArguments: [tokenUris, result.signer.address],
      })
    }
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

module.exports = deployNFTContract
