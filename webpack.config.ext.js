
const webpack = require( 'webpack' ),
    plugins = [

      // public reqire( xxx )
      new webpack.ProvidePlugin({
        React    : 'react',
        ReactDOM : 'react-dom',
        Notify   : 'notify',
      }),

      // chunk files
      new webpack.optimize.CommonsChunkPlugin({
        names     : [ 'common' ],
        minChunks : Infinity
      }),

      // defined environment variable
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify( 'production' ) // or development
      }),

    ],

    // conditions environment
    isProduction = function () {
      return process.env.NODE_ENV === 'production';
    },

    // only when environment variable is 'production' call
    deploy = ( function () {
      var CopyWebpackPlugin  = require( 'copy-webpack-plugin'  ),
          CleanWebpackPlugin = require( 'clean-webpack-plugin' );

      // environment verify
      if ( isProduction() ) {

        // delete publish folder
        plugins.push(
          new CleanWebpackPlugin([ 'publish' ], {
            verbose: true,
            dry    : false,
          })
        );

        // copy files
        plugins.push(
          new CopyWebpackPlugin([
            { from   : "ext/manifest.json" ,              to : '../' },
            
            { from   : 'ext/options/options.html',        to : '../options/' },
            { from   : 'ext/popup/popup.html',            to : '../popup/' },
            { from   : 'ext/popup/popup.css',             to : '../popup/' },

            { from   : "ext/vender/jquery-2.1.1.min.js" , to : '../vender' },
            { from   : 'ext/vender/emoji/chardict.js',    to : '../vender/emoji/' },
            { from   : 'ext/vender/emoji/categories.js',  to : '../vender/emoji/' },
            { from   : 'ext/vender/emoji/emoji_insert.js',to : '../vender/emoji/' },
            { from   : 'ext/vender/emoji/zh_emoji.js',    to : '../vender/emoji/' },
            
            { context: 'ext/assets/',      from : "*/*" , to : '../assets/' },
            { context: 'ext/_locales/',    from : "*/*" , to : '../_locales/' },
          ])
        );

        // call uglifyjs plugin
        plugins.push(
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              sequences: true,
              dead_code: true,
              conditionals: true,
              booleans: true,
              unused: true,
              if_return: true,
              join_vars: true,
              drop_console: true
            },
            mangle: {
              except: [ '$', 'exports', 'require' ]
            },
            output: {
              comments: false,
              ascii_only: true
            }
          })
        );

      }
    })(),

    // webpack config
    config = {
      entry: {

        common : [
          'jquery',
          'minimatch',
        ],

        // with options
        vendors : [

          // react
          './node_modules/react/dist/react.min.js',
          './node_modules/react-dom/dist/react-dom.min.js',

          // vendors
          'velocity',
          'notify',

          // mduikit
          'tooltip',
          'waves',
          'textfield',
          'button',
          'selectfield',
        ],

        options        : './ext/options/options.js',
        popup          : './ext/popup/popup.js',

      },

      output: {
        path     :  isProduction() ? './publish/bundle' : './ext/bundle',
        filename : '[name].js'
      },

      plugins: plugins,

      module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets: [ 'es2015', 'stage-0', 'react' ]
            }
        },
        { test: /\.css$/,           loader: 'style!css!postcss' },
        { test: /\.(png|jpg|gif)$/, loader: 'url?limit=12288'   },
        {
          test  : require.resolve( './ext/vender/jquery-2.1.1.min.js' ),
          loader: 'expose?jQuery!expose?$'
        },
        ]
      },

      postcss: function () {
        return [
          require( 'import-postcss'  )(),
          require( 'postcss-cssnext' )(),
          require( 'autoprefixer'    )({
            browsers: [ 'last 5 versions', '> 5%' ]
          })
        ]
      },

      resolve: {
        alias : {

          option     : __dirname + '/ext/options/options.js',
          setting    : __dirname + '/ext/options/setting.jsx',
          option_css : __dirname + '/ext/options/options.css',

          popup      : __dirname + '/ext/popup/popup.js',

          jquery     : __dirname + '/ext/vender/jquery-2.1.1.min.js',
          minimatch  : __dirname + '/node_modules/minimatch/minimatch.js',

          velocity   : __dirname + '/src/vender/velocity.min.js',
          wavess     : __dirname + '/src/vender/waves/waves.js',
          notify     : __dirname + '/src/vender/notify/notify.js',
          tooltip    : __dirname + '/src/vender/mduikit/tooltip.jsx',
          waves      : __dirname + '/src/vender/mduikit/waves.js',

          textfield  : __dirname + '/src/vender/mduikit/textfield.jsx',
          fab        : __dirname + '/src/vender/mduikit/fab.jsx',
          button     : __dirname + '/src/vender/mduikit/button.jsx',
          selectfield: __dirname + '/src/vender/mduikit/selectfield.jsx',
          switch     : __dirname + '/src/vender/mduikit/switch.jsx',
          tabs       : __dirname + '/src/vender/mduikit/tabs.jsx',
          progress   : __dirname + '/src/vender/mduikit/progress.jsx',
          sidebar    : __dirname + '/src/vender/mduikit/sidebar.jsx',
          list       : __dirname + '/src/vender/mduikit/list.jsx',
          dialog     : __dirname + '/src/vender/mduikit/dialog.jsx',

        }
      }
};

if ( isProduction() ) {
  config.entry.background     = './ext/background.js';
  config.entry.contentscripts = './ext/contentscripts.js';
}

module.exports = config;
