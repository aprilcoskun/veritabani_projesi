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
			IF(Select Count(*) From ogrenci where ogr_tc = @tc)>0
				Begin
				Insert Into ebeveyn Values(@tc,@veli_ad,@veli_soyad,@veli_tel,@veli_meslek)
				Insert Into ekbilgi Values(@tc,@ek_ad,@ek_soyad,@ek_tel,@aciklama,@beden_durum,@alerji)
				End
			else
			begin
				return 2
			end
			Return 1
		End
		Else
		Begin
			Return 2
		End
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

Create Proc sp_gecmis_taksit
As
	Select *
	From taksit inner join ogrenci
	on ogrenci.ogr_tc=taksit.ogr_tc
	where ((datepart(month,odeme_tar)<datepart(month,getdate()))
	and (datepart(year,odeme_tar)=datepart(year,getdate())))
	or (datepart(year,odeme_tar)<datepart(year,getdate()))
	ORDER BY odeme_tar DESC for json auto
Go

Create Proc sp_gelecek_taksit
As
	Select * From taksit inner join ogrenci
	on ogrenci.ogr_tc=taksit.ogr_tc
	where
	((datepart(month,odeme_tar)>datepart(month,getdate()))
	and
	(datepart(year,odeme_tar)=datepart(year,getdate())))
	or (datepart(year,odeme_tar)>datepart(year,getdate()))
	ORDER BY ogr_ad ASC,odeme_tar ASC
	for json auto
Go

Create Proc sp_odenmemis_taksit
As
	Select * From taksit inner join ogrenci
	on ogrenci.ogr_tc=taksit.ogr_tc
	where (datepart(month,odeme_tar)=datepart(month,getdate())
	and datepart(year,odeme_tar)=datepart(year,getdate())
	and taksit_durum='Ödenmedi')
	ORDER BY odeme_tar ASC,ogr_ad ASC
	for json auto
Go

Create Proc sp_odenmis_taksit
	Select * From  taksit inner join ogrenci
	on ogrenci.ogr_tc=taksit.ogr_tc
	where (datepart(month,odeme_tar)=datepart(month,getdate())
	and datepart(year,odeme_tar)=datepart(year,getdate())
	and taksit_durum='Ödendi' )
	ORDER BY odeme_tar ASC,ogr_ad ASC
	for json auto
Go

Create Proc sp_taksit_toplam
As
Select Month(odeme_tar) AS ay,sum(taksit_fiyat) AS toplam
	From taksit
	where Year(odeme_tar)=Year(Getdate()) and taksit_durum='Ödendi' Group By MONTH(odeme_tar) for json auto
Go

Create Proc sp_yedekten_geri_yukle
  AS
   ALTER DATABASE anaokulu
   SET SINGLE_USER
   WITH ROLLBACK IMMEDIATE

  	RESTORE DATABASE [anaokulu]
  	FROM  DISK = N'/home/alp/anaokulu_yedek.bak'
  	WITH  FILE = 1, REPLACE
  GO
