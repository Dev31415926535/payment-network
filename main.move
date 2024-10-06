module BorrowLend::PaymentGateway {
    use aptos_framework::coin;
    use aptos_framework::aptos_coin;

    // Function to transfer coins from borrower to lender
    public fun pay_rent(
        sender: &signer,
        receiver: address,
        amount: u64
    ) {
        let coin_to_transfer = coin::withdraw<aptos_coin::AptosCoin>(sender, amount);
        coin::deposit<aptos_coin::AptosCoin>(receiver, coin_to_transfer);
    }
}
