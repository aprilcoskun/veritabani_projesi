Create Trigger trg_silinen_ogrenci
On ogrenci
After Update
As
	IF update(ogr_durum)
	Begin
		Insert Into silinen_ogrenci
		(ogr_tc,ogr_ad,ogr_soyad,ogr_dog_tar,ogr_cins,ogr_adres,
		ogr_kayit_tar,ogr_durum,ogr_yas_grup,plaka,sinif_ad)
		Select ogr_tc,ogr_ad,ogr_soyad,ogr_dog_tar,ogr_cins,ogr_adres,
		ogr_kayit_tar,ogr_durum,ogr_yas_grup,plaka,sinif_ad From ogrenci where ogr_durum='Pasif'

		IF(Select Count(*) From ekbilgi where ogr_tc = (Select ogr_tc From ogrenci where ogr_durum='Pasif'))>0
			Begin
			Delete From ekbilgi Where ogr_tc=(Select ogr_tc From ogrenci where ogr_durum='Pasif')
			End

			IF(Select Count(*) From taksit where ogr_tc = (Select ogr_tc From ogrenci where ogr_durum='Pasif'))>0
				Begin
				Delete From taksit Where ogr_tc=(Select ogr_tc From ogrenci where ogr_durum='Pasif')
				End
				
		Delete From ebeveyn Where ogr_tc=(Select ogr_tc From ogrenci where ogr_durum='Pasif')
		Delete From ogrenci Where ogr_durum='Pasif'
	End



	Create Trigger trg_personel
	On personel
	After Update
	As
		IF update(per_durum)
		Begin
			Insert Into silinen_personel
			(per_tc,per_ad,per_soyad,per_dog_tar,per_tel,per_bas_tar,
			per_adres,per_email,per_maas,per_gorev,per_durum,per_sigorta_no)
			Select per_tc,per_ad,per_soyad,per_dog_tar,per_tel,per_bas_tar,
			per_adres,per_email,per_maas,per_gorev,per_durum,per_sigorta_no From personel where per_durum='Pasif'

			IF(Select Count(*) from envanter where per_tc=(Select per_tc From personel where per_durum='Pasif'))>0
					Begin
						Execute geribil
					End

			IF(Select Count(*) From giris where per_tc = (Select per_tc From personel where per_durum='Pasif'))>0
			Begin
				Delete From giris where per_tc = (Select per_tc From personel where per_durum='Pasif')
			End

			Delete From personel Where per_durum='Pasif'
		End


		Create Trigger trg_silinen_envanter
		on envanter
		instead of delete
		as
			declare @a varchar(11)
			select @a = deleted.urun_no from deleted
			insert into silinen_envanter(urun_no,urun_ad,birim_fiyat,adet,urun_kayit_tar,firma_ad,firma_tel,per_tc)
			select urun_no,urun_ad,birim_fiyat,adet,urun_kayit_tar,firma_ad,firma_tel,per_tc From envanter where urun_no=@a
