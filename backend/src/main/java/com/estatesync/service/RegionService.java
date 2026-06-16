package com.estatesync.service;

import com.estatesync.model.Region;
import com.estatesync.repository.RegionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegionService {

    private final RegionRepository regionRepository;

    public RegionService(RegionRepository regionRepository) {
        this.regionRepository = regionRepository;
    }

    public List<Region> getAllRegions() {
        return regionRepository.findAll();
    }

    public Region createRegion(Region region) {
        return regionRepository.save(region);
    }

    public Region updateRegion(Long id, Region updated) {
        Region existing = regionRepository.findById(id).orElseThrow();
        existing.setName(updated.getName());
        return regionRepository.save(existing);
    }

    public void deleteRegion(Long id) {
        regionRepository.deleteById(id);
    }
}
