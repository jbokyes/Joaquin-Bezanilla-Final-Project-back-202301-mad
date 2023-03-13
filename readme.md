# Joaquin's greatest effort

Week 6 - Challenge 5
API REST Things I already know / Lo que querais
Crea una API REST que se conecte a un fichero JSON, para manipular recursos de tipo cosas que ya sé. El JSON tendrá una sola propiedad de tipo array, donde almacenarán objetos que representarán cosas que hemos aprendido en el bootcamp.

La API REST debe tener los siguientes endpoints:

[GET] /things -> devuelve el array de cosas que ya sé

[GET] /things/:idThing -> devuelve una cosa que ya sé

[DELETE] /things/:idThing -> borra una cosa que ya sé

[POST] /things -> crea una cosa que ya sé (la recibe en el body)

[PATCH] /things -> modifica una cosa que ya sé (la recibe en el body)

Usamos express con las capas:

app
router
controller
repo
AÑADIMOS un front con REDUX testado

Lista de 'things'

Añadir 'thing'

Borrar 'thing'

Editar 'thing'

Página de detalle
