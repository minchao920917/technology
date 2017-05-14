#Technology#
这是一个基于nodejs+express+mysql的小型web项目，由于公司实行一个技术分享交流制度，即开发人员每月有一人进行一次技术分享，这样便于大家的学习。为了统计同事们学习的掌握以及分享的技术含量，便开发了这个小node项目
##项目功能分类##
1. 登录注册功能
2. 给主讲人打分功能
3. 主讲人选取下个月的主讲人
4. admin最高权限可看数据   

##Technology用到的技术##
nodejs+express+mysql
由于作者这这两个月在疯狂地学习前端node的相关技术，便拿这个来小试牛刀了

###首先，安装node+express+mysql开发环境就不一一介绍了，请翻阅资料,我们直接进入主题###

###目录结构###

>--technology             &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; //主目录  
>
>>--bin               &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; //配置node服务器参数
>>>server      
>
>>--mysql      
>>>config.js        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;//mysql信息，账号密码等
>
>>--node_modules  &emsp;&emsp;&emsp;&emsp;&emsp;//自动导入的express模块包
>>>....  
>
>>public         &emsp;&emsp;&emsp; &emsp; &emsp;&emsp;&emsp;&emsp;&emsp;//  静态文件
>>>css、js、img
>
>>--routes      &emsp; &emsp; &emsp; &emsp; &emsp;&emsp;&emsp;&emsp;// 路由机制，此项目中没有和业务逻辑分开来写
>>>admin.js   &emsp; &emsp; &emsp; &emsp;&emsp;&emsp;&emsp;//处理admin页面的业务逻辑
>
>>>grade.js
>
>>>index.js
>
>>>lottery.js
>
>>--views           &emsp; &emsp; &emsp; &emsp;&emsp;&emsp;&emsp;           //view层，存放页面
>
>>>admin.html     &emsp; &emsp; &emsp; &emsp;&emsp;&emsp;&emsp;//处理admin页面的业务逻辑
>
>>>error.html
>
>>>grade.html
>
>>>index.html
>
>>>lottery.html
>
>app.js               &emsp; &emsp; &emsp; &emsp;&emsp;&emsp;&emsp;//**重点，配置路由和静态文件，以及express的模板引擎，**
>
>package.json          &emsp; &emsp;&emsp; &emsp;&emsp;&emsp;&emsp;//存储版本号和开发moduels用到的东西
>
>technology.sql  &emsp; &emsp;&emsp; &emsp;&emsp;&emsp;&emsp;//数据库的表和部分数据


##主要代码解释     app.js
***将模板引擎的view层有ejs变成html模板引擎***

<pre> 	...	
	app.set('views', path.join(__dirname, 'views'));  
	app.engine('.html', require('ejs').__express);
	app.set('view engine', 'html');	
	...
</pre>
***将静态文件夹指向public文件夹，名称可以自定义***
<pre>	...
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	...
</pre>
>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;登录页面  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;注册页面
>
![登录页面](/pages/login.png)![登录页面](/pages/zhuce.png)  

>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;打分页面  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;抽奖页面
>
![登录页面](/pages/grade.png)![登录页面](/pages/lottery.png)

##使用说明##
clone or download之后  
  
解压，在安装好环境的前提下  

使用navicat创建明名为technology的数据库, 

右击将technology.sql文件运行  
  
进入项目文件夹，导入需要的包
<pre>
	cd --technology  
	npm install
</pre>
安装mysql数据库驱动  
<pre>
	npm install mysql
</pre>
启动项目
<pre>
	npm start
</pre>
注：使用npm慢的或者被公司墙的可以使用国内淘宝镜像，cnpm代替npm即可

nodejs项目启动成功  
![启动成功](/pages/success.png)

打开浏览器，输入<pre>http://localhost:8888/index</pre>即可访问,


由于主要是兼容手机端的，所以，只要手机保持在跟电脑在同一网段，并且可直接打开手机浏览器将localhost改成你电脑的ip地址即可访问

获取ip地址的方法-> win(Alt左边)+R -> cmd + enter -> ipconfig + enter;

----

如果你喜欢，别忘了给星星