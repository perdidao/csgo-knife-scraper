import exphbs from 'express-handlebars'

const AppSettings = (App) => {
  App.engine(
    'hbs',
    exphbs({
      defaultLayout: './default',
      extname: '.hbs'
    })
  )
  App.set('view engine', 'hbs')
  App.set('views', './app/views')

  App.listen(process.env.PORT, () =>
    console.log(`Running on localhost port ${process.env.PORT}`)
  )
}

export default AppSettings
