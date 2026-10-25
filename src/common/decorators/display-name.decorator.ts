import 'reflect-metadata';

export const DISPLAY_NAME_KEY = 'custom:display_name';

export function DisplayName(name: string): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(DISPLAY_NAME_KEY, name, target, propertyKey);
  };
}
