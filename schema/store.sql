/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/7/6 15:11:58                            */
/*==============================================================*/


drop table if exists t_attribute;

drop index idx_isdel on t_product;

drop index idx_create_time on t_product;

drop table if exists t_product;

drop index idx_create_time on t_record;

drop index idx_state on t_record;

drop table if exists t_record;

drop table if exists t_setting;

/*==============================================================*/
/* Table: t_attribute                                           */
/*==============================================================*/
create table t_attribute
(
   attr_id              int not null auto_increment,
   product_id           int,
   attribute            varchar(512),
   pic                  varchar(1024),
   stock                int not null default 0,
   oprice               decimal(10,2),
   cprice               decimal(10,2),
   create_time          datetime,
   isdel                tinyint not null default 0,
   primary key (attr_id)
);

/*==============================================================*/
/* Table: t_product                                             */
/*==============================================================*/
create table t_product
(
   product_id           int not null auto_increment,
   product_name         varchar(256),
   product_subtitle     varchar(256),
   product_image        varchar(255),
   product_image_more   text,
   product_body         text,
   product_spec         text,
   product_market_price decimal(10,2),
   product_price        decimal(10,2),
   sort                 int,
   create_time          datetime,
   isdel                tinyint default 0,
   primary key (product_id)
);

/*==============================================================*/
/* Index: idx_create_time                                       */
/*==============================================================*/
create index idx_create_time on t_product
(
   create_time
);

/*==============================================================*/
/* Index: idx_isdel                                             */
/*==============================================================*/
create index idx_isdel on t_product
(
   isdel
);

/*==============================================================*/
/* Table: t_record                                              */
/*==============================================================*/
create table t_record
(
   record_id            int not null auto_increment,
   product_name         varchar(256),
   attr                 varchar(512),
   price                decimal(10,2),
   amount               int,
   customer             varchar(32),
   cellphone            varchar(11),
   address              varchar(256),
   note                 varchar(256),
   state                enum('new','paid'),
   create_time          datetime,
   primary key (record_id)
);

/*==============================================================*/
/* Index: idx_state                                             */
/*==============================================================*/
create index idx_state on t_record
(
   state
);

/*==============================================================*/
/* Index: idx_create_time                                       */
/*==============================================================*/
create index idx_create_time on t_record
(
   create_time
);

/*==============================================================*/
/* Table: t_setting                                             */
/*==============================================================*/
create table t_setting
(
   setting_id           int not null auto_increment,
   k                    varchar(64),
   v                    text,
   primary key (setting_id)
);

INSERT INTO t_setting(k,v) VALUES
('login_name','admin'),
('passcode','123456'),
('store','taobei'),
('qrcode','/images/qrcode');

alter table t_attribute add constraint FK_attr_ref_product foreign key (product_id)
      references t_product (product_id) on delete restrict on update restrict;

