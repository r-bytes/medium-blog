export interface Post {
    _id: string;
    title: string;
    description: string;
    _createdAt: string;
    author: {
        name: string;
        image: string;
    };
    comments: Comment[];
    mainImage: {
        asset: {
            url: string;
        };
    };
    slug: {
        current: string;
    };
    body: [object];
}

export interface Comment {
    name: string;
    email: string;
    comment: string;
    approved: boolean;
    post: {
        _ref: string;
        _type: string;
    },
    _createdAt: string;
    _id: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
}