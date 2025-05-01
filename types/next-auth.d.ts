/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string; // El ID del restaurante
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    interface User {
        id: string; // El ID que retorna la función authorize
        email?: string | null;
        name?: string | null;
        image?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string; // El ID que se almacena en el token
    }
}