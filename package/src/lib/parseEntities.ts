import { decode } from "html-entities";

const parseEntities = (translate: string): string => {
    return decode(translate, { scope: "strict" });
};

export default parseEntities;
