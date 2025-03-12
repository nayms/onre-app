/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/offer_marketplace.json`.
 */
export type OfferMarketplace = {
  "address": "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF",
  "metadata": {
    "name": "offerMarketplace",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "makeOffer",
      "discriminator": [
        214,
        98,
        97,
        35,
        59,
        12,
        44,
        178
      ],
      "accounts": [
        {
          "name": "offer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  102,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "offerId"
              }
            ]
          }
        },
        {
          "name": "offerTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  102,
                  102,
                  101,
                  114,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "offerId"
              }
            ]
          }
        },
        {
          "name": "bossSellTokenAccount",
          "writable": true
        },
        {
          "name": "sellTokenMint"
        },
        {
          "name": "bossAccount"
        },
        {
          "name": "boss",
          "writable": true,
          "signer": true,
          "relations": [
            "bossAccount"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "offerId",
          "type": "u64"
        },
        {
          "name": "buyTokenMint",
          "type": "pubkey"
        },
        {
          "name": "sellTokenMint",
          "type": "pubkey"
        },
        {
          "name": "buyTokenTotalAmount",
          "type": "u64"
        },
        {
          "name": "sellTokenTotalAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setBoss",
      "discriminator": [
        144,
        141,
        235,
        104,
        167,
        250,
        41,
        54
      ],
      "accounts": [
        {
          "name": "bossAccount",
          "writable": true
        },
        {
          "name": "boss",
          "signer": true,
          "relations": [
            "bossAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "newBoss",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bossAccount",
      "discriminator": [
        128,
        211,
        135,
        163,
        102,
        184,
        152,
        232
      ]
    },
    {
      "name": "offer",
      "discriminator": [
        215,
        88,
        60,
        71,
        170,
        162,
        73,
        229
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "insufficientOfferBalance",
      "msg": "Insufficient tokens remaining in the offer."
    }
  ],
  "types": [
    {
      "name": "bossAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "boss",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "offer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "offerId",
            "type": "u64"
          },
          {
            "name": "buyTokenMint",
            "type": "pubkey"
          },
          {
            "name": "sellTokenMint",
            "type": "pubkey"
          },
          {
            "name": "buyTokenTotalAmount",
            "type": "u64"
          },
          {
            "name": "sellTokenTotalAmount",
            "type": "u64"
          },
          {
            "name": "sellTokenRemaining",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
