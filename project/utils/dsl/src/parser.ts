import { Optionable, URecord } from "@blazyts/better-standard-library";
import { ExtractParams } from "./types/extractParams";

export class MatchResponse<T extends Optionable<URecord>> {
    constructor(parts: T){}
    
    isMatched(): boolean {
        return true;
    }

    ifMatched(callback: (parts: T["raw"]) => void){
        
    }
}

class RouteHandler<TString extends string> {
    constructor(private path: TString){

    }

    isDynamicParam(part: string){
        return part.startsWith(":")
    }

    isOptional(part: string){
        return part.startsWith("?")
    }


    isMatching(path: string): MatchResponse<Optionable<ExtractParams<TString>>>{
        const partsObj: ExtractParams<TString> = {};
        const parts = path.split("/");

        const pathParts = this.path.split("/");

        for(let i = 0; i < pathParts.length; i++){
            if(this.isDynamicParam(pathParts[i])){
                if(this.isOptional(pathParts[i]) && i === parts.length -1){ 
                    partsObj[pathParts[i]] = Optionable.new(parts[i]);
                }else{
                    partsObj[pathParts[i]] = parts[i];
                }
            }else{
                if(parts[i] !== pathParts[i]) return new MatchResponse(Optionable.new(null));
            }
        }

        return new MatchResponse(Optionable.new(partsObj));
    }
}


new RouteHandler("/api/:?user/").isMatching("/api/123").ifMatched((parts) => {
    console.log(parts.user);
})