# Connecting external services to PANDORÆ

Every time PANDORÆ starts, it does a series of checks to see if standard services are online and accessible.

Some services are more custom, can be accessible only in restricted networks, and require more specific configurations. Those are only checked for when used or tested in the "User" tab of FLUX.

Not all types of services need a specific user configuration: only those that have a restricted access do.

One software user might have need for several accounts for each service. Service configs are hence stored as array-contained objects as follows.

```json
"distantServices":[
    {
      "serviceType": "zotero",            // This is required and PANDORAE-normalized. You cannot make this one up.
      "serviceConfig": {
        "accountName":"default_user",     // This is required and PANDORAE-limited. It lets you choose this account for that service within PAE.
        "library": ["0123456"],           // Service-specific: this is the actual service-side "user name" (here, a group library ID).
        "apikey": "myGreatAPIkey"         // Service-specific: the API key registered for the service user name registered above.
      }
    }
  ],
```
