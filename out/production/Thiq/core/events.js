var registeredListeners = {};

function CancelToken(listener, eventName) {
    this.$baseToken = new java.lang.Object();
    this.listener = listener;
    this.eventName = eventName;
}

CancelToken.prototype.equals = function(compare) {
    return compare.$baseToken == this.$baseToken;
}

CancelToken.prototype.unregister = function() {
    var callbacks = this.listener.callbacks[this.eventName];
    for (var i = 0; i < callbacks.length; ++i) {
        var callback = callbacks[i];
        if (this.equals(callback.cancelToken)) {
            callbacks.splice(i, 1);
            return;
        }
    }
}

function EventListener(name) {
    this.registeredEventClasses = {};
    this.callbacks = {};
    this.$baseListener = ThiqListener.newInstance(); // I don't like having to hack this, but oh well
    registeredListeners[name] = this;
}

EventListener.prototype.registerEvent = function(name, eventClass) {
    var self = this;
    this.registeredEventClasses[name] = eventClass;
    this.$baseListener.registerEvent(eventClass, function(event) {
        self.invoke(name, event);
    });
    return self;
}

EventListener.prototype.registerHandler = function(event, callback) {
    if (!this.callbacks[event]) {
        this.callbacks[event] = [];
    }
    var cancelToken = new CancelToken(this, event);
    callback.cancelToken = cancelToken;
    this.callbacks[event].push(callback);
    return callback.cancelToken;
}

EventListener.prototype.invoke = function(event, args) {
    var callbacks = this.callbacks[event];
    if (!callbacks) return;
    for (var i = 0; i < callbacks.length; ++i) {
        callbacks[i](args);
    }
}

function registerNewListener(name, eventMatches) {
    var listener = new EventListener(name);
    if (eventMatches != undefined) {
        for (var property in eventMatches) {
            if (!eventMatches.hasOwnProperty(property)) continue;
            var value = eventMatches[property];
            listener.registerEvent(property, value);
        }
    }
    return listener;
}

function eventHandler(listenerName, eventName, callback) {
    if (!registeredListeners[listenerName]) return;
    var listener = registeredListeners[listenerName];
    return listener.registerHandler(eventName, callback);
}

(function() {

    // BlockListener
    var blockEvent = org.bukkit.event.block;
    var BlockListener = registerNewListener('block', {
        break: blockEvent.BlockBreakEvent.class,
        place: blockEvent.BlockPlaceEvent.class,
        canBuild: blockEvent.BlockCanBuildEvent.class,
        damage: blockEvent.BlockDamageEvent.class,
        dispense: blockEvent.BlockDispenseEvent.class,
        exp: blockEvent.BlockExpEvent.class,
        explode: blockEvent.BlockExplodeEvent.class,
        fade: blockEvent.BlockFadeEvent.class,
        form: blockEvent.BlockFormEvent.class,
        fromTo: blockEvent.BlockFromToEvent.class,
        grow: blockEvent.BlockGrowEvent.class,
        ignite: blockEvent.BlockIgniteEvent.class,
        multiPlace: blockEvent.BlockMultiPlaceEvent.class,
        physics: blockEvent.BlockPhysicsEvent.class,
        pistonExtend: blockEvent.BlockPistonExtendEvent.class,
        pistonRetract: blockEvent.BlockPistonRetractEvent.class,
        redstone: blockEvent.BlockRedstoneEvent.class,
        spread: blockEvent.BlockSpreadEvent.class,
        cauldronLevelChange: blockEvent.CauldronLevelChangeEvent.class,
        entityForm: blockEvent.EntityBlockFormEvent.class,
        leavesDecay: blockEvent.LeavesDecayEvent.class,
        notePlay: blockEvent.NotePlayEvent.class,
        signChange: blockEvent.SignChangeEvent.class
    });

    // EnchantListener
    var enchantEvent = org.bukkit.event.enchantment;
    var EnchantListener = registerNewListener('enchantment', {
        enchant: enchantEvent.EnchantItemEvent.class,
        prepare: enchantEvent.PrepareItemEnchantEvent.class
    });

    // EntityListener
    var entityEvent = org.bukkit.event.entity;
    var EntityListener = registerNewListener('entity', {
        areaEffectCloudApply: entityEvent.AreaEffectCloudApplyEvent.class,
        enderDragonChangePhase: entityEvent.EnderDragonChangePhaseEvent.class,
        airChange: entityEvent.EntityAirChangeEvent.class,
        breed: entityEvent.EntityBreedEvent.class,
        creatureSpawn: entityEvent.CreatureSpawnEvent.class,
        creeperPower: entityEvent.CreeperPowerEvent.class,
        breakDoor: entityEvent.EntityBreakDoorEvent.class,
        changeBlock: entityEvent.EntityChangeBlockEvent.class,
        combust: entityEvent.EntityCombustEvent.class,
        combustByBlock: entityEvent.EntityCombustByBlockEvent.class,
        createPortal: entityEvent.EntityCreatePortalEvent.class,
        damage: entityEvent.EntityDamageEvent.class,
        damageByBlock: entityEvent.EntityDamageByBlockEvent.class,
        death: entityEvent.EntityDeathEvent.class,
        explode: entityEvent.EntityExplodeEvent.class,
        interact: entityEvent.EntityInteractEvent.class,
        portalEnter: entityEvent.EntityPortalEnterEvent.class,
        portalExit: entityEvent.EntityPortalExitEvent.class,
        regainHealth: entityEvent.EntityRegainHealthEvent.class,
        resurrect: entityEvent.EntityResurrectEvent.class,
        shootBow: entityEvent.EntityShootBowEvent.class,
        tame: entityEvent.EntityTameEvent.class,
        target: entityEvent.EntityTargetEvent.class,
        targetLivingEntity: entityEvent.EntityTargetLivingEntityEvent.class,
        teleport: entityEvent.EntityTeleportEvent.class,
        expBottle: entityEvent.ExpBottleEvent.class,
        explosionPrime: entityEvent.ExplosionPrimeEvent.class,
        fireworkExplode: entityEvent.FireworkExplodeEvent.class,
        foodLevelChange: entityEvent.FoodLevelChangeEvent.class,
        itemDespawn: entityEvent.ItemDespawnEvent.class,
        pigZap: entityEvent.PigZapEvent.class,
        lingeringPotionSplash: entityEvent.LingeringPotionSplashEvent.class,
        playerDeath: entityEvent.PlayerDeathEvent.class,
        playerLeashEntity: entityEvent.PlayerLeashEntityEvent.class,
        potionSplash: entityEvent.PotionSplashEvent.class,
        projectileHit: entityEvent.ProjectileHitEvent.class,
        projectileLaunch: entityEvent.ProjectileLaunchEvent.class,
        sheepDyeWool: entityEvent.SheepDyeWoolEvent.class,
        sheepRegrowWool: entityEvent.SheepRegrowWoolEvent.class,
        slimeSplit: entityEvent.SlimeSplitEvent.class,
        spawnerSpawn: entityEvent.SpawnerSpawnEvent.class,
        villagerAcquireTrade: entityEvent.VillagerAcquireTradeEvent.class,
        villagerReplenishTrade: entityEvent.VillagerReplenishTradeEvent.class
    });

    // HangingListener
    var hangingEvent = org.bukkit.event.hanging;
    var HangingListener = registerNewListener('hanging', {
        breakByEntity: hangingEvent.HangingBreakByEntityEvent.class,
        break: hangingEvent.HangingBreakEvent.class,
        place: hangingEvent.HangingPlaceEvent.class
    });

    // InventoryListener
    var invEvent = org.bukkit.event.inventory;
    var InventoryListener = registerNewListener('inventory', {
        brew: invEvent.BrewEvent.class,
        brewingStandFuel: invEvent.BrewingStandFuelEvent.class,
        craft: invEvent.CraftItemEvent.class,
        burn: invEvent.FurnaceBurnEvent.class,
        furnaceExtract: invEvent.FurnaceExtractEvent.class,
        smelt: invEvent.FurnaceSmeltEvent.class,
        click: invEvent.InventoryClickEvent.class,
        close: invEvent.InventoryCloseEvent.class,
        creative: invEvent.InventoryCreativeEvent.class,
        drag: invEvent.InventoryDragEvent.class,
        interact: invEvent.InventoryInteractEvent.class,
        moveItem: invEvent.InventoryMoveItemEvent.class,
        pickupItem: invEvent.InventoryMoveItemEvent.class,
        open: invEvent.InventoryOpenEvent.class,
        prepareAnvil: invEvent.PrepareAnvilEvent.class,
        prepareItemCraft: invEvent.PrepareItemCraftEvent.class
    });

    // PlayerListener
    var playerEvent = org.bukkit.event.player;
    var PlayerListener = registerNewListener('player', {
        asyncChat: playerEvent.AsyncPlayerChatEvent.class,
        asyncPreLogin: playerEvent.AsyncPlayerPreLoginEvent.class,
        animation: playerEvent.PlayerAnimationEvent.class,
        armorStandManipulate: playerEvent.PlayerArmorStandManipulateEvent.class,
        bedEnter: playerEvent.PlayerBedEnterEvent.class,
        bedLeave: playerEvent.PlayerBedLeaveEvent.class,
        bucketEmpty: playerEvent.PlayerBucketEmptyEvent.class,
        bucketFill: playerEvent.PlayerBucketFillEvent.class,
        changedMainHand: playerEvent.PlayerChangedMainHandEvent.class,
        changedWorld: playerEvent.PlayerChangedWorldEvent.class,
        chat: playerEvent.AsyncPlayerChatEvent.class,
        chatTabComplete: playerEvent.PlayerChatTabCompleteEvent.class,
        command: playerEvent.PlayerCommandPreprocessEvent.class,
        dropItem: playerEvent.PlayerDropItemEvent.class,
        editBook: playerEvent.PlayerEditBookEvent.class,
        eggThrow: playerEvent.PlayerEggThrowEvent.class,
        expChange: playerEvent.PlayerExpChangeEvent.class,
        fish: playerEvent.PlayerFishEvent.class,
        gameMode: playerEvent.PlayerGameModeChangeEvent.class,
        interactAt: playerEvent.PlayerInteractAtEntityEvent.class,
        interact: playerEvent.PlayerInteractEvent.class,
        interactEntity: playerEvent.PlayerInteractEntityEvent.class,
        itemBreak: playerEvent.PlayerItemBreakEvent.class,
        itemHeld: playerEvent.PlayerItemHeldEvent.class,
        join: playerEvent.PlayerJoinEvent.class,
        kick: playerEvent.PlayerKickEvent.class,
        levelChange: playerEvent.PlayerLevelChangeEvent.class,
        login: playerEvent.PlayerLoginEvent.class,
        move: playerEvent.PlayerMoveEvent.class,
        pickupArrow: playerEvent.PlayerPickupArrowEvent.class,
        portal: playerEvent.PlayerPortalEvent.class,
        preLogin: playerEvent.AsyncPlayerPreLoginEvent.class,
        quit: playerEvent.PlayerQuitEvent.class,
        registerChannel: playerEvent.PlayerRegisterChannelEvent.class,
        respawn: playerEvent.PlayerRespawnEvent.class,
        shear: playerEvent.PlayerShearEntityEvent.class,
        statisticIncrement: playerEvent.PlayerStatisticIncrementEvent.class,
        resourcePackStatus: playerEvent.PlayerResourcePackStatusEvent.class,
        swapHandItems: playerEvent.PlayerSwapHandItemsEvent.class,
        teleport: playerEvent.PlayerTeleportEvent.class,
        flight: playerEvent.PlayerToggleFlightEvent.class,
        sneak: playerEvent.PlayerToggleSneakEvent.class,
        sprint: playerEvent.PlayerToggleSprintEvent.class,
        unleash: playerEvent.PlayerUnleashEntityEvent.class,
        unregisterChannel: playerEvent.PlayerUnregisterChannelEvent.class,
        velocity: playerEvent.PlayerVelocityEvent.class
    });

    // ServerListener
    var serverEvent = org.bukkit.event.server;
    var ServerListener = registerNewListener('server', {
        mapInit: serverEvent.MapInitializeEvent.class,
        pluginDisable: serverEvent.PluginDisableEvent.class,
        pluginEnable: serverEvent.PluginEnableEvent.class,
        remoteCommand: serverEvent.RemoteServerCommandEvent.class,
        command: serverEvent.ServerCommandEvent.class,
        serverListPing: serverEvent.ServerListPingEvent.class,
        serviceRegister: serverEvent.ServiceRegisterEvent.class,
        serviceUnregister: serverEvent.ServiceUnregisterEvent.class,
        tabComplete: serverEvent.TabCompleteEvent.class
    });

    // VehicleListener
    var vehEvent = org.bukkit.event.vehicle;
    var VehicleListener = registerNewListener('vehicle', {
        blockCollision: vehEvent.VehicleBlockCollisionEvent.class,
        create: vehEvent.VehicleCreateEvent.class,
        damage: vehEvent.VehicleDamageEvent.class,
        destroy: vehEvent.VehicleDestroyEvent.class,
        enter: vehEvent.VehicleEnterEvent.class,
        entityCollision: vehEvent.VehicleEntityCollisionEvent.class,
        exit: vehEvent.VehicleExitEvent.class,
        move: vehEvent.VehicleMoveEvent.class,
        update: vehEvent.VehicleUpdateEvent.class
    });

    // WeatherListener
    var weatherEvent = org.bukkit.event.weather;
    var WeatherListener = registerNewListener('weather', {
        lightning: weatherEvent.LightningStrikeEvent.class,
        thunderChange: weatherEvent.ThunderChangeEvent.class,
        weatherChange: weatherEvent.WeatherChangeEvent.class
    });

    // WorldListener
    var worldEvent = org.bukkit.event.world;
    var WorldListener = registerNewListener('world', {
        chunkLoad: worldEvent.ChunkLoadEvent.class,
        chunkPopulate: worldEvent.ChunkPopulateEvent.class,
        chunkUnload: worldEvent.ChunkUnloadEvent.class,
        portalCreate: worldEvent.PortalCreateEvent.class,
        spawnChange: worldEvent.SpawnChangeEvent.class,
        structureGrow: worldEvent.StructureGrowEvent.class,
        init: worldEvent.WorldInitEvent.class,
        load: worldEvent.WorldLoadEvent.class,
        save: worldEvent.WorldSaveEvent.class,
        unload: worldEvent.WorldUnloadEvent.class
    });
})();