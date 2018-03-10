const force = require('d3-force-3d')
const jsonfile = require('jsonfile')

const data = jsonfile.readFileSync('./graph.json')

function calculateLayout(graph, onTick) {
    return new Promise((resolve, _reject) => {
        const graphCopy = JSON.parse(JSON.stringify(graph))

        const simulation = force
            .forceSimulation()
            .force('link', force.forceLink().id(d => d.id))
            .force('charge', force.forceManyBody())
            .force('center', force.forceCenter(300, 300))
            .nodes(graphCopy.nodes)

        simulation.force('link').links(graphCopy.links)

        simulation.on('tick', () => {
            onTick()
        })

        simulation.on('end', () => {
            const finalNodes = simulation.nodes().map(n => ({
                id: n.id,
                x: n.x,
                y: n.y
            }))
            const layoutedGraph = {
                nodes: finalNodes,
                links: graph.links
            }
            return layoutedGraph
        })
    })
}

module.exports = calculateLayout