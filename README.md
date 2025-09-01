# Minewind Bot
the huge if/else chain in main.ts was replaced with an event registry.

messageevent.ts was split into single-purpose classes (i.e SnowvasionStartEvent, SnowvasionEndEvent)

PingableEvent was created to handle logic for Discord pinging roles and removed redundant code to send a ping

Verifier was updated to use Redis to store pending verifications, so when bot restarts users with pending codes don't lose anything

Updated the configs to use .env and fallback to config.json
