export type Component<Type extends string = string, Data = any> = {
  __type: Readonly<Type>;
  data: Data;
  assign: (data: Data) => void;
};

export type ComponentDefinition<Type extends string = string, Data = any> = {
  __type: Readonly<Type>;
  __data: Readonly<Data>;
  (): Component<Type, Data>;
};

export function defineComponent<Type extends string, Data>(
  type: Type,
  data: Data
): ComponentDefinition<Type, Data> {
  return Object.assign(
    () => {
      const component = {
        __type: type,
        data,
        assign: (data: Data) => {
          component.data = data;
        },
      };
      return component;
    },
    {
      __type: type,
      __data: data,
    }
  );
}
