import { AggregateId, IEntity } from "kontext/sd/types";
export interface LinkProjection extends IEntity {
    name: string;
}
export interface BirdProjection extends IEntity {
    name: string;
}
export interface LeafProjection extends IEntity {
    name: string;
    agregate: AggregateId;
}
export interface AggregateProjection extends IEntity {
    name: string;
    type: string;
    link: LinkProjection | null;
    leafs: LeafProjection[];
    birds: BirdProjection[];
}
