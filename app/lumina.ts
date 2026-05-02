/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lumina.json`.
 */
export type Lumina = {
  "address": "3EGSobKGcyENv8jQTeZQDYtxbEe1C7PEvPkyZXVwjSZR",
  "metadata": {
    "name": "lumina",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeCourse",
      "discriminator": [
        229,
        46,
        169,
        255,
        188,
        154,
        164,
        190
      ],
      "accounts": [
        {
          "name": "course",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  114,
                  115,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "instructor"
              },
              {
                "kind": "arg",
                "path": "courseId"
              }
            ]
          }
        },
        {
          "name": "instructor",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "courseId",
          "type": "string"
        },
        {
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "issueCertificate",
      "discriminator": [
        61,
        197,
        55,
        28,
        159,
        18,
        132,
        128
      ],
      "accounts": [
        {
          "name": "certificate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  101,
                  114,
                  116,
                  105,
                  102,
                  105,
                  99,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "course"
              },
              {
                "kind": "arg",
                "path": "learner"
              }
            ]
          }
        },
        {
          "name": "course",
          "writable": true
        },
        {
          "name": "instructor",
          "writable": true,
          "signer": true,
          "relations": [
            "course"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "learner",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "certificate",
      "discriminator": [
        202,
        229,
        222,
        220,
        116,
        20,
        74,
        67
      ]
    },
    {
      "name": "course",
      "discriminator": [
        206,
        6,
        78,
        228,
        163,
        138,
        241,
        106
      ]
    }
  ],
  "types": [
    {
      "name": "certificate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "learner",
            "type": "pubkey"
          },
          {
            "name": "course",
            "type": "pubkey"
          },
          {
            "name": "issueDate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "course",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "instructor",
            "type": "pubkey"
          },
          {
            "name": "courseId",
            "type": "string"
          },
          {
            "name": "title",
            "type": "string"
          }
        ]
      }
    }
  ]
};
