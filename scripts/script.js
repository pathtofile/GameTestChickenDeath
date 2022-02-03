import { world } from "mojang-minecraft";

const dim = world.getDimension("overworld");

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

  // Check death event, do stuff here...
  dim.runCommand(`say "ent ${entity_type} | event ${event_name}"`);
});
