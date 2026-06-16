package com.estatesync.service;

import com.estatesync.model.Property;
import com.estatesync.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    public Property updateProperty(Long id, Property updated) {
        Property existing = propertyRepository.findById(id).orElseThrow();
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setType(updated.getType());
        existing.setLat(updated.getLat());
        existing.setLng(updated.getLng());
        existing.setRegion(updated.getRegion());
        
        if (updated.getImageUrls() != null) {
            existing.getImageUrls().clear();
            existing.getImageUrls().addAll(updated.getImageUrls());
        }
        return propertyRepository.save(existing);
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }
}
