const { io } = require('../index.js');
const Band = require('../models/band.js');
const Bands = require('../models/bands.js');

const bands = new Bands();

bands.addBand( new Band( 'AC/DC' ) );
bands.addBand( new Band( 'Iron Maiden' ) );
bands.addBand( new Band( 'Manowar' ) );
bands.addBand( new Band( 'Metallica' ) );

console.log(bands);


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) =>{
        console.log('Cliente conectado:', payload)

        //io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    /* client.on('emitir-mensaje', (payload) => {
        //io.emit('nuevo-mensaje', payload);// emite a todos los clientes que esten escuchando
        client.broadcast.emit('nuevo-mensaje', payload);// emite a todos menos al que lo emitio
    });

    client.on('Flutter', (payload) => {
        console.log('Flutter: ', payload)
        client.broadcast.emit('nuevo-mensaje', payload);
    }); */

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands()); //notificamos a todos los clientes conectados, incluso al que llamo a este evento
    });

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands()); //notificamos a todos los clientes conectados, incluso al que llamo a este evento
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands()); //notificamos a todos los clientes conectados, incluso al que llamo a este evento
    });

});