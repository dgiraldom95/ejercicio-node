const axios = require('axios').default
const path = require('path')
const fs = require('fs')
const http = require('http')

const url =
    'https://gist.githubusercontent.com/josejbocanegra/c6c2c82a091b880d0f6062b0a90cce88/raw/9ed13fd53a144528568d1187c1d34073b36101fd/categories.json'

const readJson = async () => await axios.get(url)

const writeToIndex = async text => fs.appendFileSync(path.join(__dirname, 'index.html'), text)

const writeHtml = async categories => {
    await fs.writeFileSync(path.join(__dirname, 'index.html'), '')
    await writeToIndex('<html>')
    await writeToIndex(`<link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossorigin="anonymous"
    />`)
    await writeToIndex('<body>')
    await writeToIndex('<div class="container">')

    await writeToIndex('<div class="accordion" id="accordionExample">')

    await writeToIndex(
        await categories
            .map((cat, index) => {
                let html = ''

                html = html.concat('<div class="card">')
                html = html.concat(`
    <div class="card-header" id="heading-${index}">
      <h2 class="mb-0">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse-${index}" aria-expanded="true" aria-controls="collapse-${index}">
          ${cat.name}
        </button>
      </h2>
    </div>
                `)

                html = html.concat(`
    <div id="collapse-${index}" class="collapse hide" aria-labelledby="heading-${index}" data-parent="#accordionExample">
        <div class="card-body">
            <div class="row">

            ${cat.products
                .map(p => {
                    return `
                <div class="col-12 col-md-6 col-lg-4">

                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src="${p.image}" alt="${p.name}">

    
                <div class="card-body">
                  <h5 class="card-title">${p.name}</h5>
                  <p class="card-text">${p.description}</p>
                  <p class="card-text"><b>${p.price}</b></p>
                  <button class="btn btn-primary">Add to cart</button>
                </div>
              </div>
              </div>`
                })
                .join('')}


        </div>
      </div>`)
                html = html.concat('</div>')
                html = html.concat('</div>')
                return html
            })
            .join(''),
    )

    await writeToIndex('</div>')

    await writeToIndex('</div>')
    await writeToIndex(`<script
    src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
    integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
    crossorigin="anonymous"
  ></script>
  <script
    src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
    integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
    crossorigin="anonymous"
  ></script>
  <script
    src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
    integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
    crossorigin="anonymous"
  ></script>
`)
    await writeToIndex('</body>')
    await writeToIndex('</html>')
}

const readFile = async file => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, file), (err, data) => {
            resolve(data)
        })
    })
}

const serve = async () => {
    http.createServer(async (req, res) => {
        const response = await readJson()
        await writeHtml(response.data)
        res.write(await readFile('index.html'))
        res.end()
    }).listen(8080)
}

serve()
