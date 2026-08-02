# OpenAPI 3.0.3 Contract Spec

> [!NOTE]
> **Backend Reference Source**: Canonical FastAPI backend implementation is located at `C:\Users\user\Documents\Tadex\app\api\auth.py`.
>
> **Contract Expansion Scope**: This contract currently details implemented Auth endpoints (`/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/me`). Planned Phase 2 endpoints (`/keys`, `/trading/*`, `/billing/*`) will be added to this specification prior to implementation.

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "Tadex Web API",
    "version": "1.0.0"
  },
  "paths": {
    "/api/v1/auth/register": {
      "post": {
        "tags": [
          "auth"
        ],
        "summary": "Register",
        "description": "Register a new web user or attach web credentials to an existing Telegram user.",
        "operationId": "register_api_v1_auth_register_post",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RegisterRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserOut"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/login": {
      "post": {
        "tags": [
          "auth"
        ],
        "summary": "Login",
        "description": "Authenticate user with email and password, returning access token and setting refresh cookie.",
        "operationId": "login_api_v1_auth_login_post",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LoginRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TokenResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/refresh": {
      "post": {
        "tags": [
          "auth"
        ],
        "summary": "Refresh",
        "description": "Rotate refresh token: revoke current token and issue new access & refresh tokens.",
        "operationId": "refresh_api_v1_auth_refresh_post",
        "parameters": [
          {
            "name": "tadex_refresh",
            "in": "cookie",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Tadex Refresh"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TokenResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/logout": {
      "post": {
        "tags": [
          "auth"
        ],
        "summary": "Logout",
        "description": "Revoke active refresh token and delete cookie.",
        "operationId": "logout_api_v1_auth_logout_post",
        "parameters": [
          {
            "name": "tadex_refresh",
            "in": "cookie",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Tadex Refresh"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Successful Response"
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/health": {
      "get": {
        "summary": "Health Check",
        "description": "Public health check endpoint.",
        "operationId": "health_check_api_v1_health_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          }
        }
      }
    },
    "/api/v1/me": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "Get Me",
        "description": "Protected endpoint to verify active access token.",
        "operationId": "get_me_api_v1_me_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          }
        },
        "security": [
          {
            "HTTPBearer": []
          }
        ]
      }
    }
  },
  "components": {
    "schemas": {
      "HTTPValidationError": {
        "properties": {
          "detail": {
            "items": {
              "$ref": "#/components/schemas/ValidationError"
            },
            "type": "array",
            "title": "Detail"
          }
        },
        "type": "object",
        "title": "HTTPValidationError"
      },
      "LoginRequest": {
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "title": "Email"
          },
          "password": {
            "type": "string",
            "title": "Password"
          }
        },
        "type": "object",
        "required": [
          "email",
          "password"
        ],
        "title": "LoginRequest"
      },
      "RegisterRequest": {
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "title": "Email"
          },
          "password": {
            "type": "string",
            "minLength": 8,
            "title": "Password",
            "description": "Password must be at least 8 characters long"
          }
        },
        "type": "object",
        "required": [
          "email",
          "password"
        ],
        "title": "RegisterRequest"
      },
      "TokenResponse": {
        "properties": {
          "access_token": {
            "type": "string",
            "title": "Access Token"
          },
          "token_type": {
            "type": "string",
            "title": "Token Type",
            "default": "bearer"
          },
          "expires_in": {
            "type": "integer",
            "title": "Expires In"
          }
        },
        "type": "object",
        "required": [
          "access_token",
          "expires_in"
        ],
        "title": "TokenResponse",
        "description": "Returned on login and refresh.\nAccess token is in the JSON response body (stored in-memory by frontend).\nRefresh token is set in the httpOnly cookie."
      },
      "UserOut": {
        "properties": {
          "id": {
            "type": "string",
            "title": "Id"
          },
          "email": {
            "type": "string",
            "format": "email",
            "title": "Email"
          },
          "email_verified": {
            "type": "boolean",
            "title": "Email Verified",
            "default": false
          },
          "status": {
            "type": "string",
            "title": "Status",
            "default": "active"
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Created At"
          }
        },
        "type": "object",
        "required": [
          "id",
          "email"
        ],
        "title": "UserOut"
      },
      "ValidationError": {
        "properties": {
          "loc": {
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "type": "array",
            "title": "Location"
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          }
        },
        "type": "object",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "title": "ValidationError"
      }
    },
    "securitySchemes": {
      "HTTPBearer": {
        "type": "http",
        "scheme": "bearer"
      }
    }
  }
}
```
