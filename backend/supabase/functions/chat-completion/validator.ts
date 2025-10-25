export async function handler(req){
    const url = new URL(req.url);

    //query parameter
    const notify = url.searchParams.get("notify");

    //Path parameter
    const userId = url.pathname.split("/").pop();

    //Header
    const token = req.headers.get("Authorization");

    //Body
    // const body = await req.json();
    // const {name, age} = body;

    // Validation on a request
    const body = await req.json();
    if(!body.name || typeof body.name != "string") {
        return new Response("Invalid name", {status : 400});
    }
    if(!body.age || typeof body.age !== "number") {
        return new Response("Invalid age", {status : 400});
    }
}



function validateUserData(data){
    if(!data.name || typeof data.name != "string") return "Invalid name";
    if(!data.age || typeof data.age != "number" || data.age < 0) return "Invalid age";
    return null;
}

export async function errorHandler(req){
    const body = await req.json();
    const error = validateUserData(body);

    if(error) return new Response(error, {status: 400});
}


