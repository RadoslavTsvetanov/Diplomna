import z from "zod/v4";

export function Without<TScehma extends z.ZodObject, TKeysToRemove extends (keyof TScehma["shape"])[]>(
    v: TScehma, 
    keysToRemove: TKeysToRemove
): z.ZodObject<Omit<TScehma["shape"], typeof keysToRemove[number]>> {
    const omitObj = keysToRemove.reduce((acc, key) => {
        acc[key as string] = true;
        return acc;
    }, {} as Record<string, true>);
    
    return v.omit(omitObj) as any;
}