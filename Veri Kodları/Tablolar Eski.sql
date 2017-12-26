CREATE TABLE personel
(
personel_no int identity(1,1) Primary Key,
per_ad varchar(15) Not Null,
per_soyad varchar(15) Not Null,
per_dogtar date Not Null
constraint ck_per_dogtar
check(per_dogtar<getdate()),
per_tel varchar(10) Not Null Unique
constraint ck_per_tel
check(per_tel Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
bastar date Not Null
constraint ck_bastar
default(getdate()),
adres varchar(200),
email varchar(30)
constraint ck_email
check(email like '%_@__%.com' or email like '%_@__%.org' and charindex(' ',email,1)=0),
maas money Not Null,
gorev varchar(10) Not Null
constraint ck_gorev
check(gorev in ('Öðretmen','Müdür','Hademe','Aþçý')),
per_durum varchar(5) Not Null
constraint ck_per_durum
check(per_durum in('Aktif','Pasif')),
sigorta_no varchar(13)
constraint ck_sigorta_no
check(sigorta_no Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
)

CREATE TABLE giris
(
personel_no int Foreign Key References personel(personel_no) Not Null,
kullaniciadi varchar(30) not null,
sifre varchar(15)
	constraint ck_sifre
	check(len(sifre)>=5)
)

Create Table envanter
(
urun_no int identity(1,1) primary key,
urun_ad varchar(10) not null,
birim_fiyat money not null,
adet int not null,
toplam_fiyat as (birim_fiyat*adet),
urun_kayittar date
	constraint ck_urun_kayittar
	check(urun_kayittar<=getdate()),
firma_ad varchar(20),
firma_tel varchar(10) Not Null
	constraint ck_firma_tel
	check(firma_tel Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
personel_no int Foreign Key References personel(personel_no) Not Null
)

Create Table servis
(
guzergah varchar(20) Not Null,
plaka varchar(9) Not Null primary key
	constraint ck_plaka
	check(plaka Like '[0-7][0-9][A-Z][A-Z][0-9][0-9][0-9]'),
soforad varchar(10) Not Null,
soforsoyad varchar(15) Not Null,
ser_tel varchar(10) Not Null Unique
	constraint ck_ser_tel
	check(ser_tel Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
)

Create Table sinif
(
sinif_ad varchar(15) primary key not null,
kapasite smallint not null,
sinif_yasgrup varchar(3) Not Null
	constraint ck_sinif_yasgrup
	check(sinif_yasgrup in('2-4','4-6')),
)

CREATE TABLE ogrenci
(
tckimno varchar(11) Not Null Primary Key
	constraint ck_tckimno
	check(len(tckimno)=11),

ad varchar(15) Not Null,

soyad varchar(20) Not Null,
dogtar date Not Null
	constraint ck_dogtar
	check(dogtar<getdate() And (YEAR(GETDATE())-YEAR(dogtar))>=2 And (YEAR(GETDATE())-YEAR(dogtar))<=6),

cins char(1) Not Null
	constraint ck_cins
	check(cins in('E','K')),

adres varchar(200) Not Null,

kayittar date Not Null
	constraint ck_kayittar
	default(getdate()),

durum varchar(5) Not Null
	constraint ck_durum
	check(durum in('Aktif','Pasif','Mezun')),

yasgrup varchar(3) Not Null
	constraint ck_yasgrup
	check(yasgrup in('2-4','4-6')),

personel_no int Foreign Key References personel(personel_no) Not Null,

plaka varchar(9) Foreign Key References servis(plaka) Not Null,

sinif_ad varchar(15) Foreign Key References sinif(sinif_ad) Not Null

)

Create Table odeme
(
tckimno int Foreign Key References ogrenci(tckimno) Not Null,
odemetipi varchar(8) not null 
	constraint ck_odemetipi
	check(odemetipi in ('Taksitli','Nakit')),
pesinat int not null,
ilk_taksit date not null
	constraint ck_ilk_taksit
	check(ilk_taksit>=getdate())
	constraint fk_ilk_taksit
	default(getdate())
)

Create Table ebeveyn
(
tckimno int Foreign Key References ogrenci(tckimno) Not Null,
veli_ad varchar(15),
veli_tel varchar(10) Unique
	constraint ck_veli_tel
	check(veli_tel Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
veli_meslek varchar(15),
)

Create Table ekbilgi
(
tckimno int Foreign Key References ogrenci(tckimno) Not Null,
ek_ad varchar(15),
ek_soyad varchar(15),
veli_tel varchar(10) Unique
	constraint ck_veli_tel
	check(veli_tel Like '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),

aciklama varchar(50),
beden_durum varchar(50),
alerji varchar(25)
)

Create Table taksit
(
tckimno int Foreign Key References ogrenci(tckimno) Not Null,
odeme_tarihi date,
taksit_fiyati int,
taksit_durum varchar(10)
	constraint ck_taksit_durum
	check(taksit_durum in ('Ödendi','Ödenmedi')),
)


