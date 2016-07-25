import $config from './lib/config';
import i18n from './lib/i18n';
import utils from './lib/utils';

// Controllers
import authController from './app/auth/auth.controller';
import blogController from './app/blog/blog.controller';
import contentController from './app/content/content.controller';
import dashboardController from './app/dashboard/dashboard.controller';
import homeController from './app/home/home.controller';
import usersController from './app/users/users.controller';

// Dashboards
import blogDashboard from './app/blog/blog.dashboard';

export default (app) => {
  const availableLanguages = $config().languages.list.join('|');

  // Content machine
  app.use('/content', contentController);

  // Set i18n content, basePath, and isMobile
  app.use((req, res, next) => {
    res.__ = res.locals.__ = i18n.load(i18n.getCurrentLanguage(req.url));
    res.locals.basePath = `${$config().baseUrl}${i18n.getLanguagePath(req.url)}`;
    res.locals.currentLanguage = i18n.getCurrentLanguage(req.url);
    res.locals.isMobile = utils.Device.isMobile(req.headers['user-agent']);
    res.locals.isConnected = true;
    res.locals.securityToken = res.session('securityToken');

    next();
  });

  // Default css & js
  app.use((req, res, next) => {
    res.locals.css = [
      '/css/style.css'
    ];

    res.locals.topJs = [];
    res.locals.bottomJs = [];

    next();
  });

  // Dashboard actions
  app.use(blogDashboard);

  // Controllers dispatch
  app.use('/', homeController);
  app.use(`/:language(${availableLanguages})`, homeController);
  app.use(`/:language(${availableLanguages})/dashboard`, dashboardController);
  app.use('/auth', authController);
  app.use('/blog', blogController);
  app.use('/dashboard', dashboardController);
  app.use('/users', usersController);

  // Disabling x-powered-by
  app.disable('x-powered-by');

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
};
