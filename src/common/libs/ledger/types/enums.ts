/**
 * transaction types
 */
export enum TransactionTypes {
    Payment = 'Payment',
    TrustSet = 'TrustSet',
    AccountDelete = 'AccountDelete',
    AccountSet = 'AccountSet',
    OfferCreate = 'OfferCreate',
    OfferCancel = 'OfferCancel',
    EscrowCreate = 'EscrowCreate',
    EscrowCancel = 'EscrowCancel',
    EscrowFinish = 'EscrowFinish',
    SetRegularKey = 'SetRegularKey',
    SignerListSet = 'SignerListSet',
    DepositPreauth = 'DepositPreauth',
    CheckCreate = 'CheckCreate',
    CheckCash = 'CheckCash',
    CheckCancel = 'CheckCancel',
    TicketCreate = 'TicketCreate',
    PaymentChannelCreate = 'PaymentChannelCreate',
    PaymentChannelClaim = 'PaymentChannelClaim',
    PaymentChannelFund = 'PaymentChannelFund',
    NFTokenMint = 'NFTokenMint',
    NFTokenBurn = 'NFTokenBurn',
    NFTokenCreateOffer = 'NFTokenCreateOffer',
    NFTokenAcceptOffer = 'NFTokenAcceptOffer',
    NFTokenCancelOffer = 'NFTokenCancelOffer',
    SetHook = 'SetHook',
    ClaimReward = 'ClaimReward',
    Invoke = 'Invoke',
    Import = 'Import',
    URITokenMint = 'URITokenMint',
    URITokenBurn = 'URITokenBurn',
    URITokenBuy = 'URITokenBuy',
    URITokenCreateSellOffer = 'URITokenCreateSellOffer',
    URITokenCancelSellOffer = 'URITokenCancelSellOffer',
    GenesisMint = 'GenesisMint',
    EnableAmendment = 'EnableAmendment',
}

/**
 * Pseudo transaction types
 */
export enum PseudoTransactionTypes {
    SignIn = 'SignIn',
    PaymentChannelAuthorize = 'PaymentChannelAuthorize',
}

export enum LedgerEntryTypes {
    AccountRoot = 'AccountRoot',
    Amendments = 'Amendments',
    AMM = 'AMM',
    Check = 'Check',
    DepositPreauth = 'DepositPreauth',
    DirectoryNode = 'DirectoryNode',
    Escrow = 'Escrow',
    FeeSettings = 'FeeSettings',
    LedgerHashes = 'LedgerHashes',
    NegativeUNL = 'NegativeUNL',
    NFTokenOffer = 'NFTokenOffer',
    NFTokenPage = 'NFTokenPage',
    Offer = 'Offer',
    Ticket = 'Ticket',
    PayChannel = 'PayChannel',
    RippleState = 'RippleState',
    SignerList = 'SignerList',
}
