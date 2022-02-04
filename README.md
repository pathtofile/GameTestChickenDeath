# Minecraft GameTest - Chicken Death Event
Example Minecraft Addon demonstrating how to run a GameTest script when a specific entity is killed.

# Requirements
This only works on Minecraft Beta, with GameTests turned on. If you don't know what this is, this isn't a good place to start.

# Overview
To make this work, there are two parts:

## Chicken entity JSON
We altered the Chicken's Behaviour JSON to trigger a new (empty) event when it
recieves fatal damage by a player:
```jsonc
{
"components": {
    // ...
    "minecraft:damage_sensor": {
        "triggers": [
          {
            "on_damage": {
              "filters": {
                "all_of": [
                  { "test": "has_damage", "value": "fatal" },
                  { "test": "is_family", "subject": "other", "value": "player" }
                ]
              },
              "event": "special_death_event",
              "target": "self"
            }
          }
          // ...
        ]
    }
    // ...
},
"events": {
    "special_death_event": { },
    //...
}
}
```

If you wanted to trigger only when killed by a specific weapon, you can add this to `on_damage:filters`:
```jsonc
{ "test": "has_equipment", "domain": "hand", "subject": "other", "value": "bucket:0"}
```

## GameTest dataDrivenEntityTriggerEvent
We then have a GameTest script that subscribes to the new event `dataDrivenEntityTriggerEvent`. This was introduces
in Beta in January 2022, so it's super new, and may change and break stuff before it's out of Beta.
Nonetheless we can use to to look for our new death event:
```javascript
world.events.dataDrivenEntityTriggerEvent.subscribe((eventData) => {
  var event_name = eventData.id;
  // Entity object, see: https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/mojang-minecraft/entity
  var entity = eventData.entity;
  var entity_type = entity.id;
  
  // Ignore other events
  // We can also filter out things when calling .subscribe(), but for now do it this way
  if (entity_type != "minecraft:chicken" || event_name != "special_death_event") {
    return;
  }

  // Can use entity.nameTag or entity.hasTag(...) or entity.hasComponent(...)
  // to further filter for a specific chicken

  // Check death event, do stuff here...
  world.getDimension("overworld").runCommand(`say "ent ${entity_type} | event ${event_name}"`);
});
```
