Create Proc sp_anasayfa
As
	Select * From sinif for json path
	Select * From personel for json path
	Select * From servis for json path
Go


Create Procedure sp_ogrenci_kayit
	@tc varchar(11),@ad varchar(15),@soyad varchar(20),@dogtar date,@cins char(1),@adres varchar(200),@kayittar date,
	@durum varchar(5),@yasgrup varchar(3),@plaka varchar(9),@sinif varchar(15),@veli_ad varchar(15),
	@veli_soyad varchar(15),@veli_tel varchar(10),@veli_meslek varchar(15),@ek_ad varchar(15),@ek_soyad varchar(15),
	@ek_tel varchar(10),@aciklama varchar(50),@beden_durum varchar(50),@alerji varchar(25)
As
	IF(Select Count(*) From personel where per_tc = @tc)=0
	Begin
		Insert Into ogrenci Values(@tc,@ad,@soyad,@dogtar,@cins,@adres,@kayittar,@durum,@yasgrup,@plaka,@sinif)
	End
	Else
	Begin
		Return print('aaa')
	End

	Insert Into ebeveyn Values(@tc,@veli_ad,@veli_soyad,@veli_tel,@veli_meslek)
	Insert Into ekbilgi Values(@tc,@ek_ad,@ek_soyad,@ek_tel,@aciklama,@beden_durum,@alerji)
Go


Create Procedure sp_ogrenci_guncelle
	@tc varchar(11),@ad varchar(15),@soyad varchar(20),@dogtar date,@cins char(1),@adres varchar(200),@kayittar date,
	@durum varchar(5),@yasgrup varchar(3),@plaka varchar(9),@sinif varchar(15),@veli_ad varchar(15),
	@veli_soyad varchar(15),@veli_tel varchar(10),@veli_meslek varchar(15),@ek_ad varchar(15),@ek_soyad varchar(15),
	@ek_tel varchar(10),@aciklama varchar(50),@beden_durum varchar(50),@alerji varchar(25)
As
	IF(Select Count(*) From personel where per_tc = @tc)=0
	Begin
		Update ogrenci set ogr_ad=@ad,ogr_soyad=@soyad,ogr_dog_tar=@dogtar,ogr_cins=@cins,ogr_adres=@adres,
		ogr_kayit_tar=@kayittar,ogr_durum=@durum,ogr_yas_grup=@yasgrup,plaka=@plaka,sinif_ad=@sinif where ogr_tc=@tc
		Return 1
	End
	Else
	Begin
		Return 2
	End

	Update ebeveyn set veli_ad=@veli_ad,veli_soyad=@veli_soyad,veli_tel=@veli_tel ,veli_meslek=@veli_meslek where ogr_tc=@tc
	Update ekbilgi set ek_ad=@ad,ek_soyad=@ek_soyad,ek_tel=@ek_tel,ek_aciklama=@aciklama,ek_beden_durum=@beden_durum,ek_alerji=@alerji where ogr_tc=@tc

Go



Create Proc sp_personel_kayit
@per_tc varchar(11),@per_ad varchar(15),@per_soyad varchar(15),@per_dog_tar date
,@per_tel varchar(10),@per_bas_tar date,@per_adres varchar(200),@per_email varchar(30),
@per_maas money,@per_gorev varchar(10),@per_durum varchar(5),@per_sigorta_no varchar(13)
As
	IF(Select Count(*) From ogrenci where ogr_tc = @per_tc)=0
	Begin
		Insert Into personel Values(@per_tc,@per_ad,@per_soyad,@per_dog_tar,@per_tel
		,@per_bas_tar,@per_adres,@per_email,@per_maas,@per_gorev,@per_durum,@per_sigorta_no)
		Return 1
	End
	Else
		Begin
		Return 2
	End
Go




Create Proc sp_personel_guncelle
@per_tc varchar(11),@per_ad varchar(15),@per_soyad varchar(15),@per_dog_tar date
,@per_tel varchar(10),@per_bas_tar date,@per_adres varchar(200),@per_email varchar(30),
@per_maas money,@per_gorev varchar(10),@per_durum varchar(5),@per_sigorta_no varchar(13)
As
	IF(Select Count(*) From ogrenci where ogr_tc = @per_tc)=0
	Begin
		Update personel Set per_ad=@per_ad,per_soyad=@per_soyad,per_dog_tar=@per_dog_tar,
		per_tel=@per_tel,per_bas_tar=@per_bas_tar,per_adres=@per_adres,per_email=@per_email,
		per_maas=@per_maas,per_gorev=@per_gorev,per_durum=@per_durum,per_sigorta_no=@per_sigorta_no
		where per_tc=@per_tc
		Return 1
	End
	Else
		Begin
		Return 2
	End
Go


Create Proc geribil
AS
		Return 409
Go

Create Proc sp_taksit
As
	Select * From taksit where datepart(month,odeme_tar)<datepart(month,getdate()) and taksit_durum='Ödenmedi' for json path
	Select * From taksit where datepart(month,odeme_tar)=datepart(month,getdate()) and taksit_durum='Ödenmedi' for json path
	Select * From taksit where datepart(month,odeme_tar)=datepart(month,getdate()) and taksit_durum='Ödendi' for json path
Go
