
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class Movie {
    id: string;
    title: string;
    actors?: Nullable<Nullable<Actor>[]>;
}

export class Actor {
    id: string;
    name: string;
    movie?: Nullable<Nullable<Movie>[]>;
}

export abstract class IQuery {
    abstract getMovies(): Movie[] | Promise<Movie[]>;

    abstract movie(id: string): Movie | Promise<Movie>;

    abstract getActor(): Actor[] | Promise<Actor[]>;

    abstract actor(id: string): Actor | Promise<Actor>;
}

type Nullable<T> = T | null;
