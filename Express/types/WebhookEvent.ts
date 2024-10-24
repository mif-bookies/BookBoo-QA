export declare enum ObjectType {
  AllowlistIdentifier = "allowlist_identifier",
  Client = "client",
  Email = "email",
  EmailAddress = "email_address",
  ExternalAccount = "external_account",
  FacebookAccount = "facebook_account",
  GoogleAccount = "google_account",
  Invitation = "invitation",
  OauthAccessToken = "oauth_access_token",
  Organization = "organization",
  OrganizationInvitation = "organization_invitation",
  OrganizationMembership = "organization_membership",
  PhoneNumber = "phone_number",
  RedirectUrl = "redirect_url",
  Session = "session",
  SignInAttempt = "sign_in_attempt",
  SignInToken = "sign_in_token",
  SignUpAttempt = "sign_up_attempt",
  SmsMessage = "sms_message",
  User = "user",
  Web3Wallet = "web3_wallet",
  Token = "token",
  TotalCount = "total_count",
}

export interface ClerkResourceJSON {
  object: ObjectType;
  id: string;
}

type Webhook<EvtType, Data> = {
  type: EvtType;
  object: "event";
  data: Data;
};

export interface VerificationJSON extends ClerkResourceJSON {
  attempts?: number | null;
  expire_at: number | null;
  external_verification_redirect_url?: string;
  nonce?: string | null;
  status: string;
  strategy: string;
  verified_at_client?: string;
}

export interface IdentificationLinkJSON extends ClerkResourceJSON {
  type: string;
}

export interface EmailAddressJSON extends ClerkResourceJSON {
  object: ObjectType.EmailAddress;
  email_address: string;
  verification: VerificationJSON | null;
  linked_to: IdentificationLinkJSON[];
}

export interface PhoneNumberJSON extends ClerkResourceJSON {
  object: ObjectType.PhoneNumber;
  phone_number: string;
  reserved_for_second_factor: boolean;
  default_second_factor: boolean;
  linked_to: IdentificationLinkJSON[];
  verification: VerificationJSON | null;
}

export interface Web3WalletJSON extends ClerkResourceJSON {
  object: ObjectType.Web3Wallet;
  web3_wallet: string;
  verification: VerificationJSON | null;
}

export interface ExternalAccountJSON extends ClerkResourceJSON {
  object: ObjectType.ExternalAccount;
  provider: string;
  identification_id: string;
  provider_user_id: string;
  approved_scopes: string;
  email_address: string;
  first_name: string;
  last_name: string;
  /**
   * @deprecated  Use `image_url` instead.
   */
  avatar_url: string;
  image_url: string;
  username: string | null;
  public_metadata: Record<string, unknown> | null;
  label: string | null;
  verification: VerificationJSON | null;
}

interface UserPublicMetadata {
  [k: string]: unknown;
}
interface UserPrivateMetadata {
  [k: string]: unknown;
}
interface UserUnsafeMetadata {
  [k: string]: unknown;
}

export interface UserJSON extends ClerkResourceJSON {
  object: ObjectType.User;
  username: string | null;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: string;
  /**
   * @deprecated  Use `image_url` instead.
   */
  profile_image_url: string;
  image_url: string;
  has_image: boolean;
  primary_email_address_id: string;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  password_enabled: boolean;
  totp_enabled: boolean;
  backup_code_enabled: boolean;
  two_factor_enabled: boolean;
  banned: boolean;
  email_addresses: EmailAddressJSON[];
  phone_numbers: PhoneNumberJSON[];
  web3_wallets: Web3WalletJSON[];
  external_accounts: ExternalAccountJSON[];
  external_id: string | null;
  last_sign_in_at: number | null;
  public_metadata: UserPublicMetadata;
  private_metadata: UserPrivateMetadata;
  unsafe_metadata: UserUnsafeMetadata;
  created_at: number;
  updated_at: number;
  create_organization_enabled: boolean;
}

export interface DeletedObjectJSON {
  object: string;
  id?: string;
  slug?: string;
  deleted: boolean;
}

export interface EmailJSON extends ClerkResourceJSON {
  object: ObjectType.Email;
  from_email_name: string;
  to_email_address?: string;
  email_address_id: string | null;
  subject?: string;
  body?: string;
  body_plain?: string | null;
  status?: string;
  slug?: string | null;
  data?: Record<string, any> | null;
  delivered_by_clerk?: boolean;
}

export interface SMSMessageJSON extends ClerkResourceJSON {
  object: ObjectType.SmsMessage;
  from_phone_number: string;
  to_phone_number: string;
  phone_number_id: string | null;
  message: string;
  status: string;
  data?: Record<string, any> | null;
}

export interface SessionJSON extends ClerkResourceJSON {
  object: ObjectType.Session;
  client_id: string;
  user_id: string;
  status: string;
  last_active_at: number;
  expire_at: number;
  abandon_at: number;
  created_at: number;
  updated_at: number;
}

interface OrganizationPublicMetadata {
  [k: string]: unknown;
}

interface OrganizationPrivateMetadata {
  [k: string]: unknown;
}

export interface OrganizationJSON extends ClerkResourceJSON {
  object: ObjectType.Organization;
  name: string;
  slug: string | null;
  /**
   * @deprecated  Use `image_url` instead.
   */
  logo_url: string | null;
  image_url: string;
  has_image: boolean;
  public_metadata: OrganizationPublicMetadata | null;
  private_metadata?: OrganizationPrivateMetadata;
  created_by: string;
  created_at: number;
  updated_at: number;
  max_allowed_memberships: number;
  admin_delete_enabled: boolean;
  members_count?: number;
}

export interface OrganizationMembershipPublicUserDataJSON {
  identifier: string;
  first_name: string | null;
  last_name: string | null;
  /**
   * @deprecated  Use `image_url` instead.
   */
  profile_image_url: string;
  image_url: string;
  has_image: boolean;
  user_id: string;
}

interface Placeholder {
  permission: unknown;
  role: unknown;
}

interface ClerkAuthorization {}

export type Autocomplete<U extends T, T = string> =
  | U
  | (T & Record<never, never>);
export type MembershipRole = ClerkAuthorization extends Placeholder
  ? ClerkAuthorization["role"] extends string
    ? ClerkAuthorization["role"] | "admin" | "basic_member" | "guest_member"
    : Autocomplete<"admin" | "basic_member" | "guest_member">
  : Autocomplete<"admin" | "basic_member" | "guest_member">;

interface OrganizationMembershipPublicMetadata {
  [k: string]: unknown;
}

interface OrganizationMembershipPrivateMetadata {
  [k: string]: unknown;
}

export interface OrganizationMembershipJSON extends ClerkResourceJSON {
  object: ObjectType.OrganizationMembership;
  organization: OrganizationJSON;
  public_metadata: OrganizationMembershipPublicMetadata;
  private_metadata?: OrganizationMembershipPrivateMetadata;
  public_user_data: OrganizationMembershipPublicUserDataJSON;
  role: MembershipRole;
  created_at: number;
  updated_at: number;
}

export type UserWebhookEvent =
  | Webhook<"user.created" | "user.updated", UserJSON>
  | Webhook<"user.deleted", DeletedObjectJSON>;
export type EmailWebhookEvent = Webhook<"email.created", EmailJSON>;
export type SMSWebhookEvent = Webhook<"sms.created", SMSMessageJSON>;
export type SessionWebhookEvent = Webhook<
  "session.created" | "session.ended" | "session.removed" | "session.revoked",
  SessionJSON
>;
export type OrganizationWebhookEvent =
  | Webhook<"organization.created" | "organization.updated", OrganizationJSON>
  | Webhook<"organization.deleted", DeletedObjectJSON>;
export type OrganizationMembershipWebhookEvent = Webhook<
  | "organizationMembership.created"
  | "organizationMembership.deleted"
  | "organizationMembership.updated",
  OrganizationMembershipJSON
>;
export type OrganizationInvitationWebhookEvent = Webhook<
  | "organizationInvitation.accepted"
  | "organizationInvitation.created"
  | "organizationInvitation.revoked",
  OrganizationInvitationJSON
>;

export type OrganizationInvitationStatus = "pending" | "accepted" | "revoked";

interface OrganizationInvitationPublicMetadata {
  [k: string]: unknown;
}
interface OrganizationInvitationPrivateMetadata {
  [k: string]: unknown;
}

export interface OrganizationInvitationJSON extends ClerkResourceJSON {
  email_address: string;
  organization_id: string;
  public_metadata: OrganizationInvitationPublicMetadata;
  private_metadata: OrganizationInvitationPrivateMetadata;
  role: MembershipRole;
  status: OrganizationInvitationStatus;
  created_at: number;
  updated_at: number;
}

export type WebhookEvent =
  | UserWebhookEvent
  | SessionWebhookEvent
  | EmailWebhookEvent
  | SMSWebhookEvent
  | OrganizationWebhookEvent
  | OrganizationMembershipWebhookEvent
  | OrganizationInvitationWebhookEvent;
