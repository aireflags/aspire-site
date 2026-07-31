import { customFetch } from "next-auth"
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers"

const LARK_AUTHORIZATION_URL =
  "https://accounts.larksuite.com/open-apis/authen/v1/authorize"
const LARK_TOKEN_URL =
  "https://open.larksuite.com/open-apis/authen/v2/oauth/token"
const LARK_USERINFO_URL =
  "https://open.larksuite.com/open-apis/authen/v1/user_info"
const LARK_OAUTH_SCOPES =
  process.env.LARK_OAUTH_SCOPES?.trim() || "contact:user.base:readonly"

export interface LarkProfile {
  open_id: string
  union_id?: string
  user_id?: string
  name?: string
  en_name?: string
  email?: string
  enterprise_email?: string
  avatar_url?: string
  avatar_big?: string
  tenant_key?: string
}

interface LarkTokenResponse {
  code?: number | string
  msg?: string
  access_token?: string
  refresh_token?: string
  expires_in?: number
  refresh_token_expires_in?: number
  scope?: string
  token_type?: string
}

interface LarkUserInfoResponse {
  code: number
  msg?: string
  data?: LarkProfile
}

function createLarkFetch() {
  return async function larkFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const requestUrl =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url

    // Lark's v2 token endpoint requires a JSON request body. Auth.js sends
    // standard OAuth token parameters as URL-encoded form data by default.
    if (requestUrl.startsWith(LARK_TOKEN_URL) && init?.body instanceof URLSearchParams) {
      const headers = new Headers(init.headers)
      headers.set("Content-Type", "application/json")

      return fetch(input, {
        ...init,
        headers,
        body: JSON.stringify(Object.fromEntries(init.body.entries())),
      })
    }

    return fetch(input, init)
  }
}

export default function Lark(
  options: OAuthUserConfig<LarkProfile>,
): OAuthConfig<LarkProfile> {
  return {
    id: "lark",
    name: "Lark",
    type: "oauth",
    checks: ["state"],
    authorization: {
      url: LARK_AUTHORIZATION_URL,
      params: {
        response_type: "code",
        scope: LARK_OAUTH_SCOPES,
      },
    },
    token: {
      url: LARK_TOKEN_URL,
      async conform(response: Response) {
        const payload = (await response.json()) as LarkTokenResponse
        const failed =
          !response.ok ||
          (payload.code !== undefined && Number(payload.code) !== 0) ||
          !payload.access_token

        if (failed) {
          return Response.json(
            {
              error: "invalid_grant",
              error_description:
                payload.msg ?? "Lark did not return a valid access token",
            },
            { status: 400 },
          )
        }

        const { code: _code, msg: _msg, ...tokens } = payload
        return Response.json({
          ...tokens,
          token_type: tokens.token_type ?? "Bearer",
        })
      },
    },
    userinfo: {
      url: LARK_USERINFO_URL,
      async request({
        tokens,
      }: {
        tokens: { access_token?: string }
      }) {
        if (!tokens.access_token) {
          throw new Error("Lark did not return an access token")
        }

        const response = await fetch(LARK_USERINFO_URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "Content-Type": "application/json; charset=utf-8",
          },
          cache: "no-store",
        })
        const payload = (await response.json()) as LarkUserInfoResponse

        if (!response.ok || payload.code !== 0 || !payload.data) {
          throw new Error(payload.msg ?? "Unable to retrieve the Lark profile")
        }

        return payload.data
      },
    },
    profile(profile) {
      if (!profile.open_id) {
        throw new Error("Lark profile is missing open_id")
      }

      return {
        id: profile.open_id,
        name: profile.name ?? profile.en_name ?? "Lark user",
        email: profile.enterprise_email ?? profile.email ?? null,
        image: profile.avatar_url ?? profile.avatar_big ?? null,
      }
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    [customFetch]: createLarkFetch(),
    style: {
      brandColor: "#3370FF",
    },
    options,
  }
}
