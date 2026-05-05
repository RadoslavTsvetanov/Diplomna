import { panic } from "@blazyts/better-standard-library"
import React, { useState } from "react"

type InputElementProps = React.InputHTMLAttributes<HTMLInputElement>

type InputHookConfig<T extends string | number> = {
    default: T
    onChange?: (value: T) => void
    performSideEffect?: (value: T) => void
    additionalProperties?: Omit<InputElementProps, "defaultValue" | "onChange" | "value">
}

export function useInput<T extends string | number>(config: InputHookConfig<T>) {
    if (!config.onChange && !config.performSideEffect) {
        panic("cannot omit both performSideEffect and onChange")
    }

    const [state, setState] = useState<T>(config.default)


    const input = <input 
    value={state} 
    onChange={v => {
        const newV = v.target.value
        if(config.onChange?.(newV)){
            return
        }
        if(config.performSideEffect?.(newV)){
            setState(newV)
            return    
        }
        setState(newV)
        
    }}
     {...config.additionalProperties} />

    return {
        el: input,
        state,
        setState,
    }
}

const {el: nameInput} = useInput({
    default: "",
    performSideEffect: console.log
})



