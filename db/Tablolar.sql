CREATE TABLE personel
(
per_tc varchar(11)  Primary Key
	constraint ck_per_tc
	check(len(per_tc)=11),
per_ad varchar(15) ,
per_soyad varchar(15) ,
per_dog_tar date
constraint ck_per_dog_tar
check(per_dog_tar<getdate()),
per_tel varchar(10)  Unique
constraint ck_per_tel
check(per_tel Like '[5][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
per_bas_tar date
constraint ck_per_bas_tar
default(getdate()),
per_adres varchar(200),
per_email varchar(30)
constraint ck_per_email
check(per_email like '%_@__%.com' or per_email like '%_@__%.org' and charindex(' ',per_email,1)=0),
per_maas money ,
per_gorev varchar(10)
constraint ck_per__gorev
check(per_gorev in ('Öğretmen','Müdür','Hademe','Aşçı')),
per_durum varchar(5)
constraint ck_per_durum
check(per_durum in('Aktif','Pasif')),
per_sigorta_no varchar(13)
constraint ck_per_sigorta_no
check(per_sigorta_no Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
)

CREATE TABLE giris
(
per_tc varchar(11) Foreign Key References personel(per_tc) ,
kullanici_adi varchar(30) UNIQUE,
kullanici_sifre varchar(64)
)

Create Table envanter
(
urun_no int identity(1,1) primary key,
urun_ad varchar(10) ,
birim_fiyat money ,
adet int ,
toplam_fiyat as (birim_fiyat*adet),
urun_kayit_tar date
	constraint ck_urun_kayit_tar
	check(urun_kayit_tar<=getdate()),
firma_ad varchar(20),
firma_tel varchar(10)
	constraint ck_firma_tel
	check(firma_tel Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
per_tc varchar(11) Foreign Key References personel(per_tc)
)

Create Table servis
(
guzergah varchar(20) ,
plaka varchar(9)  primary key
	constraint ck_plaka
	check(plaka Like '[0-7][0-9][A-Z][A-Z][0-9][0-9][0-9]'),
sofor_ad varchar(10) ,
sofor_soyad varchar(15) ,
ser_tel varchar(10)  Unique
	constraint ck_ser_tel
	check(ser_tel Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
)

Create Table sinif
(
sinif_ad varchar(15) primary key ,
kapasite smallint ,
sinif_yas_grup varchar(3)
	constraint ck_sinif_yas_grup
	check(sinif_yas_grup in('2-4','4-6')),
)

CREATE TABLE ogrenci
(
ogr_tc varchar(11)  Primary Key
	constraint ck_ogr_tc
	check(len(ogr_tc)=11),

ogr_ad varchar(15) ,

ogr_soyad varchar(20) ,
ogr_dog_tar date
	constraint ck_ogr_dog_tar
	check(ogr_dog_tar<getdate() And (YEAR(GETDATE())-YEAR(ogr_dog_tar))>=2 And (YEAR(GETDATE())-YEAR(ogr_dog_tar))<=6),

ogr_cins varchar(1)
	constraint ck_ogr_cins
	check(ogr_cins in('E','K')),

ogr_adres varchar(200) ,

ogr_kayit_tar date
	constraint ck_ogr_kayit_tar
	default(getdate()),

ogr_durum varchar(5)
	constraint ck_ogr_durum
	check(ogr_durum in('Aktif','Pasif','Mezun')),

ogr_yas_grup varchar(3)
	constraint ck_ogr_yas_grup
	check(ogr_yas_grup in('2-4','4-6')),

plaka varchar(9) Foreign Key References servis(plaka) ,
sinif_ad varchar(15) Foreign Key References sinif(sinif_ad)

)

Create Table ebeveyn
(
ogr_tc varchar(11) Foreign Key References ogrenci(ogr_tc) ,
veli_ad varchar(15),
veli_soyad varchar(15),
veli_tel varchar(10) Unique
	constraint ck_veli_tel
	check(veli_tel Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
veli_meslek varchar(15),
)

Create Table ekbilgi
(
ogr_tc varchar(11) Foreign Key References ogrenci(ogr_tc) ,
ek_ad varchar(15),
ek_soyad varchar(15),
ek_tel varchar(10) Unique
	constraint ck_ek_tel
	check(ek_tel Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),

ek_aciklama varchar(50),
ek_beden_durum varchar(50),
ek_alerji varchar(25)
)

Create Table taksit
(
ogr_tc varchar(11) Foreign Key References ogrenci(ogr_tc) ,
odeme_tar date,
taksit_fiyat money,
taksit_durum varchar(10)
	constraint ck_taksit_durum
	check(taksit_durum in ('�dendi','�denmedi')),
)

CREATE TABLE silinen_ogrenci
(
ogr_tc varchar(11),
ogr_ad varchar(15) ,
ogr_soyad varchar(20) ,
ogr_dog_tar date,
ogr_cins varchar(1),
ogr_adres varchar(200) ,
ogr_kayit_tar date,
ogr_durum varchar(5),
ogr_yas_grup varchar(3),
plaka varchar(9) Foreign Key References servis(plaka) ,
sinif_ad varchar(15) Foreign Key References sinif(sinif_ad)

)


CREATE TABLE silinen_personel
(
per_tc varchar(11),
per_ad varchar(15) ,
per_soyad varchar(15),
per_dog_tar date,
per_tel varchar(10),
per_bas_tar date,
per_adres varchar(200),
per_email varchar(30),
per_maas money ,
per_gorev varchar(10),
per_durum varchar(5),
per_sigorta_no varchar(13)
)
