export interface RelyingPartyOverrides {
    signAssertion?: boolean;
    dontSignResponse?: boolean;
    turnOffEncryption?: boolean;
    useSha?: boolean;
    ignoreAuthenticationMethod?: boolean;
    omitNotBefore?: boolean;
    responderId?: string;
    nameIdFormats: string[];
    authenticationMethods: string[];
}
