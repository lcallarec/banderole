# banderole

Banderole is a versatile Javascript feature-flag/toggle library designed with simplicity in mind.

## How to use

Feature flags are described in a json configuration file, under a root `feature` key :

```json
{
    "features": {
        "switchboard": ...,
        "clock": ...
    }
}
```

## Flags definition

### As boolean value

```json
{
    "features": {
        "switchboard": true,
        "clock": false
    }
}
```

### Requesting a non-existing flag

Whenever you try to request an non-existing flag, it'll be considered as disabled.




