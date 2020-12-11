import "kontext/examples/modules";
import { IEntity } from "kontext/sd/types";
interface PersonProjection extends IEntity {
    family: string;
    name: string;
    secName: string;
    username: string;
    email: string;
    birthday: string;
    famIO: string;
}
export interface TeacherProjection extends IEntity {
    person: PersonProjection;
}
export {};
