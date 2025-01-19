async function main() {
    const Roulette = await ethers.getContractFactory("Roulette");
    const roulette = await Roulette.deploy();
    await roulette.deployed();
    console.log("Contract deployed to:", roulette.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
