// Authority or Role type
type Authority = {
    authority: string;
};

// UserDetails type
export type UserDetails = {
    id: string;
    username: string;
    password: string;
    role: "SUPPORT" | "CLIENT";
    authorities: Authority[];
};