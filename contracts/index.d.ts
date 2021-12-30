declare module 'ioc:factory/Core' {
  import { Ignitor, Factory, Application } from '@sportek/core-next-sportek'
  export {
    Ignitor,
    Factory,
    Application,
  }
}

declare module 'ioc:factory/Core/Provider' {
  import { BaseProvider, EntityResolvable, CommandEntity, EventEntity, HookEntity } from '@sportek/core-next-sportek'
  export {
    BaseProvider,
    EntityResolvable,
    CommandEntity,
    EventEntity,
    HookEntity,
  }
}

declare module 'ioc:factory/Core/Container' {
  import { CommandContainer, EventContainer, HookContainer } from '@sportek/core-next-sportek'
  export {
    CommandContainer,
    EventContainer,
    HookContainer,
  }
}

declare module 'ioc:factory/Core/Event' {
  import { BaseEvent, Event } from '@sportek/core-next-sportek'
  export {
    BaseEvent,
    Event,
  }
}

declare module 'ioc:factory/Core/Command' {
  import { BaseCommand, Command } from '@sportek/core-next-sportek'
  export {
    BaseCommand,
    Command,
  }
}

declare module 'ioc:factory/Core/ContextMenu' {
  import { BaseContextMenu, ContextMenu } from '@sportek/core-next-sportek'
  export {
    BaseContextMenu,
    ContextMenu,
  }
}

declare module 'ioc:factory/Core/Hook' {
  import { BaseHook, Hook } from '@sportek/core-next-sportek'
  export {
    BaseHook,
    Hook,
  }
}