import {app} from './app.js'
import {uri, client} from './app.js'
import ip from 'ip'

const PORT = 19001;

try {
    await client.connect(uri);
    app.listen(PORT, () => {
       console.log("Server is listening...");
       console.log(ip.address())
    });
 } catch (error) {
    console.log(error)
 }